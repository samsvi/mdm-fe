import { Component, h, Host, State, Listen } from '@stencil/core';
import { PatientsApi, Configuration } from '../../api/mdm';

@Component({
  tag: 'samsvi-mdm-main-content',
  styleUrl: 'samsvi-mdm-main-content.css',
  shadow: true,
})
export class SamsviMdmMainContent {
  @State() patients: any[] = [];
  @State() loading = true;
  @State() error: string | null = null;
  @State() searchQuery = '';
  @State() selectedStatus = 'all';
  @State() isMobileView = false;
  @State() selectedPatient: any = null;
  @State() showPatientDetail = false;

  private patientsApi: PatientsApi;
  private patientModal: HTMLSamsviMdmPatientModalElement;

  constructor() {
    const isDevelopment = window.location.hostname === 'localhost';
    const apiBaseUrl = isDevelopment ? 'http://localhost:8080/api' : '/api';

    this.patientsApi = new PatientsApi(
      new Configuration({
        basePath: apiBaseUrl,
      }),
    );
  }

  async componentWillLoad() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    await this.loadPatients();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  async loadPatients() {
    try {
      this.loading = true;
      this.error = null;
      const patients = await this.patientsApi.getAllPatients();
      this.patients = patients;
    } catch (error) {
      console.error('Error loading patients:', error);
      this.error = 'Error loading patients. Please try again later.';
    } finally {
      this.loading = false;
    }
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 768;
  }

  @Listen('statusFilterChanged')
  statusFilterChangedHandler(event: CustomEvent) {
    this.selectedStatus = event.detail;
  }

  @Listen('patientCreated')
  async patientCreatedHandler(event: CustomEvent) {
    console.log('Patient created event received:', event.detail);
    // Reload patients when new patient is created
    await this.loadPatients();
  }

  @Listen('searchInput')
  searchInputHandler(event: CustomEvent) {
    this.handleSearchInput(event.detail);
  }

  @Listen('patientSelected')
  patientSelectedHandler(event: CustomEvent) {
    if (event.detail.type === 'navigate') {
      this.selectedPatient = event.detail.patient;
      this.showPatientDetail = true;
      return;
    }

    if (event.detail.type === 'view-detail') {
      this.selectedPatient = event.detail.patient;
      this.showPatientDetail = true;
      return;
    }

    // Handle refresh requests
    if (event.detail === 'refresh') {
      this.loadPatients();
      return;
    }
  }

  @Listen('close')
  handlePatientDetailClose() {
    this.showPatientDetail = false;
    this.selectedPatient = null;
  }

  @Listen('patientUpdated')
  async handlePatientUpdated() {
    // Reload patients after update
    await this.loadPatients();
    this.showPatientDetail = false;
    this.selectedPatient = null;
  }

  handleSearchInput(event) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  handleAddPatient = () => {
    this.patientModal?.openModal();
  };

  get filteredPatients() {
    return this.patients.filter(patient => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(this.searchQuery) || (patient.medicalNotes && patient.medicalNotes.toLowerCase().includes(this.searchQuery));

      const matchesStatus = this.selectedStatus === 'all' || patient.status.toLowerCase() === this.selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }

  get patientStats() {
    const total = this.patients.length;
    const stable = this.patients.filter(p => p.status?.toLowerCase() === 'stable').length;
    const mild = this.patients.filter(p => p.status?.toLowerCase() === 'mild').length;
    const critical = this.patients.filter(p => p.status?.toLowerCase() === 'critical').length;

    return { total, stable, mild, critical };
  }

  render() {
    if (this.showPatientDetail && this.selectedPatient) {
      return (
        <Host>
          <samsvi-mdm-patient-detail patient={this.selectedPatient}></samsvi-mdm-patient-detail>
        </Host>
      );
    }

    const stats = this.patientStats;

    if (this.loading) {
      return (
        <Host>
          <div class="loading-container">
            <md-circular-progress indeterminate></md-circular-progress>
            <p>Loading patients...</p>
          </div>
        </Host>
      );
    }

    return (
      <Host>
        <div class="main-content">
          <samsvi-mdm-header></samsvi-mdm-header>

          <samsvi-mdm-stats
            totalPatients={stats.total}
            mildPatients={stats.mild}
            stablePatients={stats.stable}
            criticalPatients={stats.critical}
            isMobileView={this.isMobileView}
          ></samsvi-mdm-stats>

          <samsvi-mdm-table-controls onInput={e => this.handleSearchInput(e)} selectedStatus={this.selectedStatus}></samsvi-mdm-table-controls>

          <samsvi-mdm-patients-table patients={this.filteredPatients} isMobileView={this.isMobileView}></samsvi-mdm-patients-table>

          <samsvi-mdm-patient-modal ref={el => (this.patientModal = el)}></samsvi-mdm-patient-modal>

          {this.error && (
            <div class="error-banner">
              <md-icon>error</md-icon>
              <span>{this.error}</span>
              <md-button onClick={() => this.loadPatients()}>Retry</md-button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
