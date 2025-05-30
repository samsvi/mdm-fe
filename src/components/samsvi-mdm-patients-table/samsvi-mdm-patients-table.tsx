import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { PatientsApi } from '../../api/mdm/apis/PatientsApi';

@Component({
  tag: 'samsvi-mdm-patients-table',
  styleUrl: 'samsvi-mdm-patients-table.css',
  shadow: true,
})
export class SamsviMdmPatientsTable {
  @Prop() patients: any[] = [];
  @Prop() isMobileView: boolean = false;
  @Event() patientSelected: EventEmitter<string>;

  @State() internalPatients: any[] = [];
  @State() loading: boolean = true;
  @State() error: string | null = null;
  @State() openedMenuPatientId: string | null = null;

  private patientsApi: PatientsApi;

  constructor() {
    this.patientsApi = new PatientsApi();
  }

  async componentWillLoad() {
    await this.loadPatients();
  }

  async loadPatients() {
    try {
      this.loading = true;
      this.error = null;
      const patients = await this.patientsApi.getAllPatients();
      this.internalPatients = patients;
    } catch (error) {
      console.error('Error loading patients:', error);
      this.error = 'Error loading patients. Please try again later.';
    } finally {
      this.loading = false;
    }
  }

  handleActionClick(patientId: string) {
    this.openedMenuPatientId = this.openedMenuPatientId === patientId ? null : patientId;
  }

  async handleDelete(patient: any) {
    const confirmed = window.confirm(`Naozaj chcete vymazať pacienta ${patient.name || patient.firstName + ' ' + patient.lastName}?`);
    if (confirmed) {
      try {
        await this.patientsApi.deletePatient({ patientId: patient.id });
        if (this.patients.length === 0) {
          await this.loadPatients();
        } else {
          this.patientSelected.emit('refresh');
        }
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
    const patientsToRender = this.patients.length > 0 ? this.patients : this.internalPatients;

    return (
      <div class="patients-cards">
        {patientsToRender.map(patient => (
          <div class="patient-card" key={patient.id}>
            <div class="patient-header">
              <div class="patient-name">{patient.name || `${patient.firstName} ${patient.lastName}`}</div>
              <span class={`status-badge ${(patient.status || 'active').toLowerCase()}`}>{patient.status || 'Aktívny'}</span>
            </div>

            <div class="patient-details">
              <div class="detail-row">
                <span class="detail-label">Posledná návšteva:</span>
                <span class="detail-value">{patient.lastAppointment || patient.lastVisit || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Vek:</span>
                <span class="detail-value">{patient.age || this.calculateAge(patient.dateOfBirth)}</span>
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
                <span class="detail-label">Diagnóza:</span>
                <span class="detail-value">{patient.diagnosis || patient.primaryDiagnosis || 'N/A'}</span>
              </div>
            </div>

            <div class="patient-actions">{this.renderActions(patient)}</div>
          </div>
        ))}
      </div>
    );
  }

  renderDesktopView() {
    const patientsToRender = this.patients.length > 0 ? this.patients : this.internalPatients;

    return (
      <table>
        <thead>
          <tr>
            <th>
              <md-checkbox></md-checkbox>
            </th>
            <th>Meno</th>
            <th>Posledná návšteva</th>
            <th>Vek</th>
            <th>Dátum narodenia</th>
            <th>Pohlavie</th>
            <th>Diagnóza</th>
            <th>Stav</th>
            <th>Akcie</th>
          </tr>
        </thead>
        <tbody>
          {patientsToRender.map(patient => (
            <tr key={patient.id}>
              <td>
                <md-checkbox></md-checkbox>
              </td>
              <td>{patient.name || `${patient.firstName} ${patient.lastName}`}</td>
              <td>{patient.lastAppointment || patient.lastVisit || 'N/A'}</td>
              <td>{patient.age || this.calculateAge(patient.dateOfBirth)}</td>
              <td>{patient.dateOfBirth || 'N/A'}</td>
              <td>{patient.gender || 'N/A'}</td>
              <td>{patient.diagnosis || patient.primaryDiagnosis || 'N/A'}</td>
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
    if (this.loading) {
      return (
        <Host>
          <div class="loading-container">
            <md-circular-progress indeterminate></md-circular-progress>
            <p>Načítavam pacientov...</p>
          </div>
        </Host>
      );
    }

    if (this.error) {
      return (
        <Host>
          <div class="error-container">
            <md-icon>error</md-icon>
            <p>{this.error}</p>
            <md-filled-button onClick={() => this.loadPatients()}>Skúsiť znovu</md-filled-button>
          </div>
        </Host>
      );
    }

    return (
      <Host>
        <div class="patients-table">
          {this.patients.length === 0 && this.internalPatients.length === 0 ? (
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
