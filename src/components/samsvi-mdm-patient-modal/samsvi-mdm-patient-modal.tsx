import { Component, Host, h, State, Method, Event, EventEmitter } from '@stencil/core';
import { PatientsApi, Configuration } from '../../api/mdm';

@Component({
  tag: 'samsvi-mdm-patient-modal',
  styleUrl: 'samsvi-mdm-patient-modal.css',
  shadow: true,
})
export class SamsviMdmPatientModal {
  @State() open = false;
  @State() firstName = '';
  @State() lastName = '';
  @State() dateOfBirth = '';
  @State() gender = '';
  @State() insuranceNumber = '';
  @State() bloodType = '';
  @State() status = 'Stable';
  @State() allergies = '';
  @State() notes = '';
  @State() loading = false;
  @State() error: string | null = null;

  @Event() patientCreated: EventEmitter<any>;

  private patientsApi: PatientsApi;

  constructor() {
    const isDevelopment = window.location.hostname === 'localhost';
    const apiBaseUrl = isDevelopment ? 'http://localhost:8080/api' : '/mdm-api';

    this.patientsApi = new PatientsApi(
      new Configuration({
        basePath: apiBaseUrl,
      }),
    );
  }

  @Method()
  async openModal() {
    this.open = true;
    this.resetForm();
    this.error = null;
  }

  @Method()
  async closeModal() {
    this.open = false;
  }

  private handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (this.loading) return;

    try {
      this.loading = true;
      this.error = null;

      const patientId = `pat${Date.now()}${Math.floor(Math.random() * 1000)}`;

      const patient = {
        id: patientId,
        firstName: this.firstName,
        lastName: this.lastName,
        dateOfBirth: new Date(this.dateOfBirth),
        gender: this.gender as any,
        insuranceNumber: this.insuranceNumber,
        bloodType: this.bloodType as any,
        status: this.status as any,
        allergies: this.allergies,
        medicalNotes: this.notes,
      };

      console.log('Creating patient:', patient);

      const createdPatient = await this.patientsApi.createPatient({ patient });

      console.log('Patient created successfully:', createdPatient);

      this.patientCreated.emit(createdPatient);

      await this.closeModal();
      this.resetForm();
    } catch (error) {
      console.error('Error creating patient:', error);
      this.error = error.message || 'Chyba pri vytváraní pacienta. Skúste to znovu.';
    } finally {
      this.loading = false;
    }
  };

  private resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.dateOfBirth = '';
    this.gender = '';
    this.insuranceNumber = '';
    this.bloodType = '';
    this.status = 'Stable';
    this.allergies = '';
    this.notes = '';
  }

  render() {
    return (
      <Host>
        {this.open && (
          <div class="modal-backdrop">
            <md-dialog open={this.open} class="patient-dialog">
              <div slot="headline">Add New Patient</div>

              <form onSubmit={this.handleSubmit}>
                <div slot="content" class="modal-content">
                  {this.error && (
                    <div class="error-message" style={{ color: 'red', marginBottom: '16px' }}>
                      <md-icon>error</md-icon>
                      <span>{this.error}</span>
                    </div>
                  )}

                  <div class="form-row">
                    <md-filled-text-field label="First Name" required value={this.firstName} onInput={(e: any) => (this.firstName = e.target.value)}></md-filled-text-field>

                    <md-filled-text-field label="Last Name" required value={this.lastName} onInput={(e: any) => (this.lastName = e.target.value)}></md-filled-text-field>
                  </div>

                  <div class="form-row">
                    <md-filled-text-field
                      label="Date of Birth"
                      type="date"
                      required
                      value={this.dateOfBirth}
                      onInput={(e: any) => (this.dateOfBirth = e.target.value)}
                    ></md-filled-text-field>

                    <md-filled-select label="Gender" required value={this.gender} onInput={(e: any) => (this.gender = e.target.value)}>
                      <md-select-option value="M">Male</md-select-option>
                      <md-select-option value="F">Female</md-select-option>
                      <md-select-option value="O">Other</md-select-option>
                    </md-filled-select>
                  </div>

                  <md-filled-text-field
                    class="full-width"
                    label="Insurance Number"
                    required
                    value={this.insuranceNumber}
                    onInput={(e: any) => (this.insuranceNumber = e.target.value)}
                  ></md-filled-text-field>

                  <div class="form-row">
                    <md-filled-select label="Blood Type" value={this.bloodType} onInput={(e: any) => (this.bloodType = e.target.value)}>
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

                    <md-filled-select label="Status" value={this.status} onInput={(e: any) => (this.status = e.target.value)}>
                      <md-select-option value="Stable">Stable</md-select-option>
                      <md-select-option value="Mild">Mild</md-select-option>
                      <md-select-option value="Critical">Critical</md-select-option>
                    </md-filled-select>
                  </div>

                  <md-filled-text-field
                    class="full-width"
                    label="Allergies"
                    type="textarea"
                    rows={2}
                    value={this.allergies}
                    onInput={(e: any) => (this.allergies = e.target.value)}
                  ></md-filled-text-field>

                  <md-filled-text-field
                    class="full-width"
                    label="Medical Notes"
                    type="textarea"
                    rows={3}
                    value={this.notes}
                    onInput={(e: any) => (this.notes = e.target.value)}
                  ></md-filled-text-field>
                </div>

                <div slot="actions">
                  <md-filled-button type="button" onClick={() => this.closeModal()}>
                    Cancel
                  </md-filled-button>
                  <md-filled-button type="submit" disabled={this.loading}>
                    {this.loading ? 'Saving...' : 'Save Patient'}
                  </md-filled-button>
                </div>
              </form>
            </md-dialog>
          </div>
        )}
      </Host>
    );
  }
}
