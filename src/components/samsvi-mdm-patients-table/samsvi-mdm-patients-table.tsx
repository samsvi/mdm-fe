import { Component, Host, h, Prop, State, Event, EventEmitter, Listen } from '@stencil/core';
import { PatientsApi, Configuration } from '../../api/mdm';

@Component({
  tag: 'samsvi-mdm-patients-table',
  styleUrl: 'samsvi-mdm-patients-table.css',
  shadow: true,
})
export class SamsviMdmPatientsTable {
  @Prop() patients: any[] = [];
  @Prop() isMobileView: boolean = false;
  @Event() patientSelected: EventEmitter<any>;

  @State() openedMenuPatientId: string | null = null;

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

  // Close menu when clicking outside
  @Listen('click', { target: 'document' })
  handleDocumentClick(event: MouseEvent) {
    const target = event.target as Element;
    if (!target.closest('.actions-container')) {
      this.openedMenuPatientId = null;
    }
  }

  handleActionClick(patientId: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent document click from closing immediately
    this.openedMenuPatientId = this.openedMenuPatientId === patientId ? null : patientId;
  }

  async handleDelete(patient: any, event: MouseEvent) {
    event.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete patient ${patient.firstName + ' ' + patient.lastName}?`);
    if (confirmed) {
      try {
        await this.patientsApi.deletePatient({ patientId: patient.id });
        this.patientSelected.emit('refresh');
        console.log('Patient deleted successfully');
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Error deleting patient');
      }
    }
    this.openedMenuPatientId = null;
  }

  handleViewDetails(patient: any, event: MouseEvent) {
    event.stopPropagation();
    this.patientSelected.emit({ type: 'navigate', url: `/patients/${patient.id}`, patient: patient });
    this.openedMenuPatientId = null;
  }

  renderActions(patient: any) {
    const isOpen = this.openedMenuPatientId === patient.id;

    return (
      <div class="actions-container">
        <md-standard-icon-button onClick={e => this.handleActionClick(patient.id, e)}>
          <md-icon>more_vert</md-icon>
        </md-standard-icon-button>
        {isOpen && (
          <div class="action-menu">
            <button onClick={e => this.handleViewDetails(patient, e)}>Show details</button>
            <button onClick={e => this.handleDelete(patient, e)}>Delete</button>
          </div>
        )}
      </div>
    );
  }

  renderMobileView() {
    return (
      <div class="patients-cards">
        {this.patients.map(patient => (
          <div class="patient-card" key={patient.id}>
            <div class="patient-header">
              <div class="patient-name">{`${patient.firstName} ${patient.lastName}`}</div>
              <span class={`status-badge ${(patient.status || 'active').toLowerCase()}`}>{patient.status || 'Active'}</span>
            </div>

            <div class="patient-details">
              <div class="detail-row">
                <span class="detail-label">Last visit:</span>
                <span class="detail-value">N/A</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Age:</span>
                <span class="detail-value">{this.calculateAge(patient.dateOfBirth)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Gender:</span>
                <span class="detail-value">{this.getGenderDisplay(patient.gender)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Allergies:</span>
                <span class="detail-value">{patient.allergies || 'None'}</span>
              </div>
            </div>

            <div class="patient-actions">{this.renderActions(patient)}</div>
          </div>
        ))}
      </div>
    );
  }

  renderDesktopView() {
    return (
      <table>
        <thead>
          <tr>
            <th>
              <md-checkbox></md-checkbox>
            </th>
            <th>Name</th>
            <th>Age</th>
            <th>Date of birth</th>
            <th>Gender</th>
            <th>Insurance Number</th>
            <th>Blood type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.patients.map(patient => (
            <tr key={patient.id}>
              <td>
                <md-checkbox></md-checkbox>
              </td>
              <td>
                <strong>{`${patient.firstName} ${patient.lastName}`}</strong>
              </td>
              <td>{this.calculateAge(patient.dateOfBirth)}</td>
              <td>{this.formatDate(patient.dateOfBirth)}</td>
              <td>{this.getGenderDisplay(patient.gender)}</td>
              <td>{patient.insuranceNumber || 'N/A'}</td>
              <td>{patient.bloodType || 'N/A'}</td>
              <td>
                <span class={`status-badge ${(patient.status || 'active').toLowerCase()}`}>{patient.status || 'Active'}</span>
              </td>
              <td>{this.renderActions(patient)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

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

  formatDate(dateString: string): string {
    if (!dateString || dateString === 'undefined') return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sk-SK');
    } catch {
      return 'N/A';
    }
  }

  getGenderDisplay(gender: string): string {
    switch (gender) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      case 'O':
        return 'Other';
      default:
        return 'N/A';
    }
  }

  render() {
    return (
      <Host>
        <div class="patients-table">
          {this.patients.length === 0 ? (
            <div class="empty-state">
              <md-icon>person_off</md-icon>
              <p>No patients were found.</p>
            </div>
          ) : this.isMobileView ? (
            this.renderMobileView()
          ) : (
            this.renderDesktopView()
          )}
        </div>
      </Host>
    );
  }
}
