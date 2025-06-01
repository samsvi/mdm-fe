import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { PatientsApi, MedicalRecordsApi, Configuration } from '../../api/mdm';

@Component({
  tag: 'samsvi-mdm-patient-detail',
  styleUrl: 'samsvi-mdm-patient-detail.css',
  shadow: true,
})
export class SamsviMdmPatientDetail {
  @Prop() patient: any = {}; // Prop pre patient data
  @Event() close: EventEmitter<void>;
  @Event() patientUpdated: EventEmitter<any>;

  @State() isEditing = false;
  @State() editablePatient: any = {};
  @State() loading = false;
  @State() error: string | null = null;

  // Medical records state
  @State() medicalRecords: any[] = [];
  @State() loadingRecords = false;
  @State() newRecord = '';
  @State() editingRecordId: string | null = null;
  @State() editingRecordText = '';

  private patientsApi: PatientsApi;
  private medicalRecordsApi: MedicalRecordsApi;

  constructor() {
    const isDevelopment = window.location.hostname === 'localhost';
    const apiBaseUrl = isDevelopment ? 'http://localhost:8080/api' : '/api';

    const config = new Configuration({
      basePath: apiBaseUrl,
    });

    this.patientsApi = new PatientsApi(config);
    this.medicalRecordsApi = new MedicalRecordsApi(config);
  }

  componentWillLoad() {
    // Inicializácia editablePatient s pôvodnými údajmi
    this.editablePatient = { ...this.patient };
    // Load medical records
    this.loadMedicalRecords();
  }

  handleInputChange(field: string, value: string) {
    this.editablePatient = { ...this.editablePatient, [field]: value };
  }

  startEditing = () => {
    this.isEditing = true;
    this.editablePatient = { ...this.patient }; // Reset changes
    this.error = null;
  };

  cancelEditing = () => {
    this.isEditing = false;
    this.editablePatient = { ...this.patient }; // Reset changes
    this.error = null;
  };

  saveChanges = async () => {
    if (this.loading) return;

    try {
      this.loading = true;
      this.error = null;

      // Validácia povinných polí
      if (
        !this.editablePatient.firstName ||
        !this.editablePatient.lastName ||
        !this.editablePatient.dateOfBirth ||
        !this.editablePatient.gender ||
        !this.editablePatient.insuranceNumber
      ) {
        this.error = 'Všetky povinné polia musia byť vyplnené';
        return;
      }

      // Vytvorenie patient objektu pre API
      const updatedPatient = {
        ...this.editablePatient,
        dateOfBirth: new Date(this.editablePatient.dateOfBirth),
      };

      // Volanie API pre aktualizáciu
      const result = await this.patientsApi.updatePatient({
        patientId: this.patient.id,
        patient: updatedPatient,
      });

      console.log('Patient updated successfully:', result);

      // Update local state
      this.patient = { ...this.editablePatient };
      this.isEditing = false;

      // Emit event pre parent komponent
      this.patientUpdated.emit(result);
    } catch (error) {
      console.error('Error updating patient:', error);
      this.error = error.message || 'Chyba pri aktualizácii pacienta';
    } finally {
      this.loading = false;
    }
  };

  calculateAge(dateOfBirth: string): string {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    // Convert date to YYYY-MM-DD format for input
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Medical Records Methods
  loadMedicalRecords = async () => {
    if (!this.patient.id) return;

    try {
      this.loadingRecords = true;
      const records = await this.medicalRecordsApi.getPatientMedicalRecords({
        patientId: this.patient.id,
      });
      this.medicalRecords = records || [];
    } catch (error) {
      console.error('Error loading medical records:', error);
      this.medicalRecords = [];
    } finally {
      this.loadingRecords = false;
    }
  };

  addRecord = async () => {
    if (!this.newRecord.trim() || !this.patient.id) return;

    try {
      this.loadingRecords = true;

      // Generovanie jedinečného ID pre record
      const recordId = `rec${Date.now()}${Math.floor(Math.random() * 1000)}`;

      const medicalRecord = {
        id: recordId,
        patientId: this.patient.id,
        diagnosis: this.newRecord.trim(),
        treatment: '',
        notes: '',
        recordDate: new Date(),
        dateOfVisit: new Date(),
      };

      const createdRecord = await this.medicalRecordsApi.createMedicalRecord({
        patientId: this.patient.id,
        medicalRecord,
      });

      this.medicalRecords = [...this.medicalRecords, createdRecord];
      this.newRecord = '';
    } catch (error) {
      console.error('Error adding medical record:', error);
    } finally {
      this.loadingRecords = false;
    }
  };

  startEditingRecord = (record: any) => {
    this.editingRecordId = record.id;
    this.editingRecordText = record.diagnosis || '';
  };

  cancelEditingRecord = () => {
    this.editingRecordId = null;
    this.editingRecordText = '';
  };

  saveRecord = async (record: any) => {
    if (!this.editingRecordText.trim()) return;

    try {
      this.loadingRecords = true;

      const updatedRecord = {
        ...record,
        diagnosis: this.editingRecordText.trim(),
        dateOfVisit: record.dateOfVisit || new Date(),
      };

      const result = await this.medicalRecordsApi.updateMedicalRecord({
        patientId: this.patient.id,
        recordId: record.id,
        medicalRecord: updatedRecord,
      });

      // Update local state
      this.medicalRecords = this.medicalRecords.map(r => (r.id === record.id ? result : r));

      this.editingRecordId = null;
      this.editingRecordText = '';
    } catch (error) {
      console.error('Error updating medical record:', error);
    } finally {
      this.loadingRecords = false;
    }
  };

  deleteRecord = async (record: any) => {
    if (!confirm('Ste si istí, že chcete vymazať tento záznam?')) return;

    try {
      this.loadingRecords = true;

      await this.medicalRecordsApi.deleteMedicalRecord({
        patientId: this.patient.id,
        recordId: record.id,
      });

      this.medicalRecords = this.medicalRecords.filter(r => r.id !== record.id);
    } catch (error) {
      console.error('Error deleting medical record:', error);
    } finally {
      this.loadingRecords = false;
    }
  };

  formatRecordDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK');
  }

  render() {
    const displayPatient = this.isEditing ? this.editablePatient : this.patient;

    return (
      <Host>
        <div class="waccare-container">
          <samsvi-mdm-sidebar></samsvi-mdm-sidebar>
          <div class="content">
            <section class="header">
              <div class="header-controls">
                <md-filled-button onClick={() => this.close.emit()}>
                  <md-icon slot="icon">arrow_back</md-icon>
                  Späť na zoznam
                </md-filled-button>

                {!this.isEditing ? (
                  <md-filled-button onClick={this.startEditing}>
                    <md-icon slot="icon">edit</md-icon>
                    Editovať
                  </md-filled-button>
                ) : (
                  <div class="edit-controls">
                    <md-outlined-button onClick={this.cancelEditing} disabled={this.loading}>
                      Zrušiť
                    </md-outlined-button>
                    <md-filled-button onClick={this.saveChanges} disabled={this.loading}>
                      {this.loading ? 'Ukladá sa...' : 'Uložiť'}
                    </md-filled-button>
                  </div>
                )}
              </div>

              <h1>{`${displayPatient.firstName || ''} ${displayPatient.lastName || ''}`}</h1>

              {this.error && (
                <div class="error-message">
                  <md-icon>error</md-icon>
                  <span>{this.error}</span>
                </div>
              )}
            </section>

            <section class="basic-info">
              <h2>Základné informácie</h2>

              <div class="info-grid">
                <md-filled-text-field
                  label="Meno"
                  value={displayPatient.firstName || ''}
                  readonly={!this.isEditing}
                  required={this.isEditing}
                  onInput={(e: any) => this.handleInputChange('firstName', e.target.value)}
                ></md-filled-text-field>

                <md-filled-text-field
                  label="Priezvisko"
                  value={displayPatient.lastName || ''}
                  readonly={!this.isEditing}
                  required={this.isEditing}
                  onInput={(e: any) => this.handleInputChange('lastName', e.target.value)}
                ></md-filled-text-field>

                <md-filled-text-field
                  label="Dátum narodenia"
                  type="date"
                  value={this.formatDateForInput(displayPatient.dateOfBirth)}
                  readonly={!this.isEditing}
                  required={this.isEditing}
                  onInput={(e: any) => this.handleInputChange('dateOfBirth', e.target.value)}
                ></md-filled-text-field>

                <md-filled-text-field label="Vek" value={this.calculateAge(displayPatient.dateOfBirth)} readonly={true}></md-filled-text-field>

                {this.isEditing ? (
                  <md-filled-select label="Pohlavie" required value={displayPatient.gender || ''} onInput={(e: any) => this.handleInputChange('gender', e.target.value)}>
                    <md-select-option value="M">Male</md-select-option>
                    <md-select-option value="F">Female</md-select-option>
                    <md-select-option value="O">Other</md-select-option>
                  </md-filled-select>
                ) : (
                  <md-filled-text-field
                    label="Pohlavie"
                    value={
                      displayPatient.gender === 'M' ? 'Male' : displayPatient.gender === 'F' ? 'Female' : displayPatient.gender === 'O' ? 'Other' : displayPatient.gender || ''
                    }
                    readonly={true}
                  ></md-filled-text-field>
                )}

                <md-filled-text-field
                  label="Rodné číslo"
                  value={displayPatient.insuranceNumber || ''}
                  readonly={!this.isEditing}
                  required={this.isEditing}
                  onInput={(e: any) => this.handleInputChange('insuranceNumber', e.target.value)}
                ></md-filled-text-field>

                {this.isEditing ? (
                  <md-filled-select label="Krvná skupina" value={displayPatient.bloodType || ''} onInput={(e: any) => this.handleInputChange('bloodType', e.target.value)}>
                    <md-select-option value="">-- Select --</md-select-option>
                    <md-select-option value="A+">A+</md-select-option>
                    <md-select-option value="A-">A-</md-select-option>
                    <md-select-option value="B+">B+</md-select-option>
                    <md-select-option value="B-">B-</md-select-option>
                    <md-select-option value="AB+">AB+</md-select-option>
                    <md-select-option value="AB-">AB-</md-select-option>
                    <md-select-option value="O+">O+</md-select-option>
                    <md-select-option value="O-">O-</md-select-option>
                  </md-filled-select>
                ) : (
                  <md-filled-text-field label="Krvná skupina" value={displayPatient.bloodType || ''} readonly={true}></md-filled-text-field>
                )}

                {this.isEditing ? (
                  <md-filled-select label="Stav" value={displayPatient.status || ''} onInput={(e: any) => this.handleInputChange('status', e.target.value)}>
                    <md-select-option value="Stable">Stable</md-select-option>
                    <md-select-option value="Recovering">Recovering</md-select-option>
                    <md-select-option value="Critical">Critical</md-select-option>
                  </md-filled-select>
                ) : (
                  <md-filled-text-field label="Stav" value={displayPatient.status || ''} readonly={true}></md-filled-text-field>
                )}
              </div>

              <md-filled-text-field
                label="Alergie"
                type="textarea"
                rows={3}
                value={displayPatient.allergies || ''}
                readonly={!this.isEditing}
                onInput={(e: any) => this.handleInputChange('allergies', e.target.value)}
                class="full-width"
              ></md-filled-text-field>

              <md-filled-text-field
                label="Lekárske poznámky"
                type="textarea"
                rows={4}
                value={displayPatient.medicalNotes || ''}
                readonly={!this.isEditing}
                onInput={(e: any) => this.handleInputChange('medicalNotes', e.target.value)}
                class="full-width"
              ></md-filled-text-field>
            </section>

            <section class="records">
              <h2>Lekárske záznamy</h2>

              {/* Add new record */}
              <div class="add-record">
                <md-filled-text-field
                  label="Nový záznam"
                  value={this.newRecord}
                  onInput={(e: any) => (this.newRecord = e.target.value)}
                  class="record-input"
                ></md-filled-text-field>
                <md-filled-button onClick={this.addRecord} disabled={this.loadingRecords || !this.newRecord.trim()}>
                  Pridať záznam
                </md-filled-button>
              </div>

              {/* Records list */}
              {this.loadingRecords ? (
                <div class="loading-message">Načítavajú sa záznamy...</div>
              ) : this.medicalRecords.length === 0 ? (
                <div class="no-records">Žiadne lekárske záznamy.</div>
              ) : (
                <div class="records-list">
                  {this.medicalRecords.map(record => (
                    <div key={record.id} class="record-item">
                      <div class="record-header">
                        <span class="record-date">{this.formatRecordDate(record.recordDate)}</span>
                        <div class="record-actions">
                          {this.editingRecordId === record.id ? (
                            <div class="edit-actions">
                              <md-outlined-button onClick={this.cancelEditingRecord} disabled={this.loadingRecords}>
                                Zrušiť
                              </md-outlined-button>
                              <md-filled-button onClick={() => this.saveRecord(record)} disabled={this.loadingRecords || !this.editingRecordText.trim()}>
                                Uložiť
                              </md-filled-button>
                            </div>
                          ) : (
                            <div class="view-actions">
                              <md-icon-button onClick={() => this.startEditingRecord(record)}>
                                <md-icon>edit</md-icon>
                              </md-icon-button>
                              <md-icon-button onClick={() => this.deleteRecord(record)}>
                                <md-icon>delete</md-icon>
                              </md-icon-button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div class="record-content">
                        {this.editingRecordId === record.id ? (
                          <md-filled-text-field
                            value={this.editingRecordText}
                            onInput={(e: any) => (this.editingRecordText = e.target.value)}
                            class="full-width"
                          ></md-filled-text-field>
                        ) : (
                          <p class="record-text">{record.diagnosis || 'Bez popisu'}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </Host>
    );
  }
}
