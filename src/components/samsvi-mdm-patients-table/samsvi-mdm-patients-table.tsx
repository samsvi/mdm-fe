import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { PatientsApi, Configuration } from '../../api/mdm';

@Component({
  tag: 'samsvi-mdm-patients-table',
  styleUrl: 'samsvi-mdm-patients-table.css',
  shadow: true,
})
export class SamsviMdmPatientsTable {
  @Prop() patients: any[] = [];
  @Prop() isMobileView: boolean = false;
  @Event() patientSelected: EventEmitter<string>;

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

  handleActionClick(patientId: string) {
    this.openedMenuPatientId = this.openedMenuPatientId === patientId ? null : patientId;
  }

  async handleDelete(patient: any) {
    const confirmed = window.confirm(`Naozaj chcete vymazať pacienta ${patient.firstName + ' ' + patient.lastName}?`);
    if (confirmed) {
      try {
        await this.patientsApi.deletePatient({ patientId: patient.id });
        this.patientSelected.emit('refresh');
        console.log('Patient deleted successfully');
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Chyba pri mazaní pacienta');
      }
    }
    this.openedMenuPatientId = null;
  }

  handleViewDetails(patient: any) {
    this.patientSelected.emit(patient.id);
    this.openedMenuPatientId = null;
  }

  renderActions(patient: any) {
    const isOpen = this.openedMenuPatientId === patient.id;

    return (
      <div class="actions-container">
        <md-standard-icon-button onClick={() => this.handleActionClick(patient.id)}>
          <md-icon>more_horiz</md-icon>
        </md-standard-icon-button>
        {isOpen && (
          <div class="action-menu">
            <button onClick={() => this.handleViewDetails(patient)}>Zobraziť detail</button>
            <button onClick={() => this.handleDelete(patient)}>Vymazať</button>
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
              <span class={`status-badge ${(patient.status || 'active').toLowerCase()}`}>{patient.status || 'Aktívny'}</span>
            </div>

            <div class="patient-details">
              <div class="detail-row">
                <span class="detail-label">Posledná návšteva:</span>
                <span class="detail-value">N/A</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Vek:</span>
                <span class="detail-value">{this.calculateAge(patient.dateOfBirth)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Dátum narodenia:</span>
                <span class="detail-value">{patient.dateOfBirth || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pohlavie:</span>
                <span class="detail-value">{patient.gender || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Alergie:</span>
                <span class="detail-value">{patient.allergies || 'N/A'}</span>
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
            <th>Meno</th>
            <th>Vek</th>
            <th>Dátum narodenia</th>
            <th>Pohlavie</th>
            <th>Rodné číslo</th>
            <th>Krvná skupina</th>
            <th>Stav</th>
            <th>Akcie</th>
          </tr>
        </thead>
        <tbody>
          {this.patients.map(patient => (
            <tr key={patient.id}>
              <td>
                <md-checkbox></md-checkbox>
              </td>
              <td>{`${patient.firstName} ${patient.lastName}`}</td>
              <td>{this.calculateAge(patient.dateOfBirth)}</td>
              <td>{patient.dateOfBirth || 'N/A'}</td>
              <td>{patient.gender || 'N/A'}</td>
              <td>{patient.insuranceNumber || 'N/A'}</td>
              <td>{patient.bloodType || 'N/A'}</td>
              <td>
                <span class={`status-badge ${(patient.status || 'active').toLowerCase()}`}>{patient.status || 'Aktívny'}</span>
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

  render() {
    return (
      <Host>
        <div class="patients-table">
          {this.patients.length === 0 ? (
            <div class="empty-state">
              <md-icon>person_off</md-icon>
              <p>Žiadni pacienti neboli nájdení</p>
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
