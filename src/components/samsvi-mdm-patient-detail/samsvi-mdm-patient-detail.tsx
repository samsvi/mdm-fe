import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { PatientsApi, Configuration } from '../../api/mdm';

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

  private patientsApi: PatientsApi;

  constructor() {
    const isDevelopment = window.location.hostname === 'localhost';
    const apiBaseUrl = isDevelopment ? 'http://localhost:8080/api' : '/api';

    this.patientsApi = new PatientsApi(
      new Configuration({
        basePath: apiBaseUrl,
      }),
    );
  }

  componentWillLoad() {
    // Inicializácia editablePatient s pôvodnými údajmi
    this.editablePatient = { ...this.patient };
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
                <md-outlined-text-field
                  label="Meno"
                  value={displayPatient.firstName || ''}
                  readonly={!this.isEditing}
                  onInput={(e: any) => this.handleInputChange('firstName', e.target.value)}
                ></md-outlined-text-field>

                <md-outlined-text-field
                  label="Priezvisko"
                  value={displayPatient.lastName || ''}
                  readonly={!this.isEditing}
                  onInput={(e: any) => this.handleInputChange('lastName', e.target.value)}
                ></md-outlined-text-field>

                <md-outlined-text-field
                  label="Dátum narodenia"
                  type="date"
                  value={this.formatDateForInput(displayPatient.dateOfBirth)}
                  readonly={!this.isEditing}
                  onInput={(e: any) => this.handleInputChange('dateOfBirth', e.target.value)}
                ></md-outlined-text-field>

                <md-outlined-text-field label="Vek" value={this.calculateAge(displayPatient.dateOfBirth)} readonly={true}></md-outlined-text-field>

                <md-outlined-text-field
                  label="Pohlavie"
                  value={displayPatient.gender || ''}
                  readonly={!this.isEditing}
                  onInput={(e: any) => this.handleInputChange('gender', e.target.value)}
                ></md-outlined-text-field>

                <md-outlined-text-field
                  label="Rodné číslo"
                  value={displayPatient.insuranceNumber || ''}
                  readonly={!this.isEditing}
                  onInput={(e: any) => this.handleInputChange('insuranceNumber', e.target.value)}
                ></md-outlined-text-field>

                <md-outlined-text-field
                  label="Krvná skupina"
                  value={displayPatient.bloodType || ''}
                  readonly={!this.isEditing}
                  onInput={(e: any) => this.handleInputChange('bloodType', e.target.value)}
                ></md-outlined-text-field>

                <md-outlined-text-field
                  label="Stav"
                  value={displayPatient.status || ''}
                  readonly={!this.isEditing}
                  onInput={(e: any) => this.handleInputChange('status', e.target.value)}
                ></md-outlined-text-field>
              </div>

              <md-outlined-text-field
                label="Alergie"
                type="textarea"
                rows={3}
                value={displayPatient.allergies || ''}
                readonly={!this.isEditing}
                onInput={(e: any) => this.handleInputChange('allergies', e.target.value)}
                class="full-width"
              ></md-outlined-text-field>

              <md-outlined-text-field
                label="Lekárske poznámky"
                type="textarea"
                rows={4}
                value={displayPatient.medicalNotes || ''}
                readonly={!this.isEditing}
                onInput={(e: any) => this.handleInputChange('medicalNotes', e.target.value)}
                class="full-width"
              ></md-outlined-text-field>
            </section>
            {/* <section class="records">
              <h3>Lekárske záznamy</h3>
              <ul>
                {this.patient.records.map((record, index) => (
                  <li key={index}>{record}</li>
                ))}
              </ul>
              <md-outlined-text-field label="Nový záznam" value={this.newRecord} onInput={(e: any) => (this.newRecord = e.target.value)}></md-outlined-text-field>
              <md-filled-button onClick={() => this.addRecord()}>Pridať záznam</md-filled-button>
            </section> */}
          </div>
        </div>
      </Host>
    );
  }
}
