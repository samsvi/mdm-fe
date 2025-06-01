import { Component, Host, h, State, Event, EventEmitter } from '@stencil/core';
import { PatientsApi, Configuration } from '../../api/mdm';

@Component({
  tag: 'samsvi-mdm-patient-form',
  styleUrl: 'samsvi-mdm-patient-form.css',
  shadow: true,
})
export class SamsviMdmPatientForm {
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
  @State() showForm = false;

  @Event() patientCreated: EventEmitter<any>;
  @Event() formClosed: EventEmitter<void>;

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

  showPatientForm = () => {
    this.showForm = true;
    this.resetForm();
    this.error = null;
  };

  hidePatientForm = () => {
    this.showForm = false;
    this.resetForm();
    this.formClosed.emit();
  };

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

      this.hidePatientForm();
    } catch (error) {
      console.error('Error creating patient:', error);
      this.error = error.message || 'Error creating patient. Please try again.';
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
    if (!this.showForm) {
      return (
        <Host>
          <div class="add-patient-card">
            <div class="card-content">
              <div class="card-icon">
                <md-icon>person_add</md-icon>
              </div>
              <h3>Add New Patient</h3>
              <p>Create a new patient record with their basic information and medical details.</p>
              <md-filled-button onClick={this.showPatientForm} class="add-button">
                <md-icon slot="icon">add</md-icon>
                Add Patient
              </md-filled-button>
            </div>
          </div>
        </Host>
      );
    }

    return (
      <Host>
        <div class="patient-form-container">
          <div class="form-header">
            <div class="header-content">
              <md-icon-button onClick={this.hidePatientForm} class="back-button">
                <md-icon>arrow_back</md-icon>
              </md-icon-button>
              <div class="header-text">
                <h2>Add New Patient</h2>
                <p>Fill in the patient's information below</p>
              </div>
            </div>
          </div>

          <div class="form-content">
            <form onSubmit={this.handleSubmit} class="patient-form">
              {this.error && (
                <div class="error-message">
                  <md-icon>error</md-icon>
                  <span>{this.error}</span>
                </div>
              )}

              <div class="form-section">
                <h3>Basic Information</h3>

                <div class="form-grid">
                  <md-filled-text-field label="First Name" required value={this.firstName} onInput={(e: any) => (this.firstName = e.target.value)}></md-filled-text-field>

                  <md-filled-text-field label="Last Name" required value={this.lastName} onInput={(e: any) => (this.lastName = e.target.value)}></md-filled-text-field>

                  <md-filled-text-field
                    label="Date of Birth"
                    type="date"
                    required
                    value={this.dateOfBirth}
                    onInput={(e: any) => (this.dateOfBirth = e.target.value)}
                  ></md-filled-text-field>

                  <md-filled-select label="Gender" required value={this.gender} onInput={(e: any) => (this.gender = e.target.value)}>
                    <md-select-option value="">-- Select Gender --</md-select-option>
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
              </div>

              <div class="form-section">
                <h3>Medical Information</h3>

                <div class="form-grid">
                  <md-filled-select label="Blood Type" value={this.bloodType} onInput={(e: any) => (this.bloodType = e.target.value)}>
                    <md-select-option value="">-- Select Blood Type --</md-select-option>
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
                  class="full-width textarea-field"
                  label="Allergies"
                  type="textarea"
                  rows={3}
                  value={this.allergies}
                  onInput={(e: any) => (this.allergies = e.target.value)}
                ></md-filled-text-field>

                <md-filled-text-field
                  class="full-width"
                  label="Medical Notes"
                  type="textarea"
                  rows={4}
                  value={this.notes}
                  onInput={(e: any) => (this.notes = e.target.value)}
                ></md-filled-text-field>
              </div>

              <div class="form-actions">
                <md-outlined-button type="button" onClick={this.hidePatientForm} disabled={this.loading}>
                  Cancel
                </md-outlined-button>
                <md-filled-button type="submit" disabled={this.loading}>
                  {this.loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <md-circular-progress indeterminate style={{ width: '16px', height: '16px' }}></md-circular-progress>
                      Creating...
                    </div>
                  ) : (
                    'Create Patient'
                  )}
                </md-filled-button>
              </div>
            </form>
          </div>
        </div>
      </Host>
    );
  }
}
