import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-patient-detail',
  styleUrl: 'samsvi-mdm-patient-detail.css',
  shadow: true,
})
export class SamsviMdmPatientDetail {
  @Prop() patientId: string;
  @Event() close: EventEmitter<void>;

  @State() patient = {
    name: '',
    birthdate: '',
    bloodType: '',
    password: '',
    visits: [],
    records: [],
  };

  @State() newVisit = '';
  @State() newRecord = '';

  handleInputChange(field: string, value: string) {
    this.patient = { ...this.patient, [field]: value };
  }

  addVisit() {
    if (this.newVisit.trim()) {
      this.patient = {
        ...this.patient,
        visits: [...this.patient.visits, this.newVisit],
      };
      this.newVisit = '';
    }
  }

  addRecord() {
    const modalElement = document.querySelector('samsvi-mdm-record-modal') as HTMLElement & { openModal: () => Promise<void> };
    if (modalElement) {
      modalElement.openModal();
    }
  }

  render() {
    return (
      <Host>
        <div class="waccare-container">
          <samsvi-mdm-sidebar></samsvi-mdm-sidebar>
          <div class="content">
            <section class="header">
              <md-filled-button onClick={() => this.close.emit()}>Späť na zoznam</md-filled-button>
              <h1>Samuel Svitek</h1>
            </section>

            <section class="basic-info">
              <md-outlined-text-field label="Meno" value={this.patient.name} onInput={(e: any) => this.handleInputChange('name', e.target.value)}></md-outlined-text-field>
              <md-outlined-text-field
                label="Heslo"
                type="password"
                value={this.patient.password}
                onInput={(e: any) => this.handleInputChange('password', e.target.value)}
              ></md-outlined-text-field>
              <md-outlined-text-field
                label="Krvná skupina"
                value={this.patient.bloodType}
                onInput={(e: any) => this.handleInputChange('bloodType', e.target.value)}
              ></md-outlined-text-field>
              <md-outlined-text-field
                label="Dátum narodenia"
                type="date"
                value={this.patient.birthdate}
                onInput={(e: any) => this.handleInputChange('birthdate', e.target.value)}
              ></md-outlined-text-field>
            </section>

            <section class="records">
              <h3>Lekárske záznamy</h3>
              <ul>
                {this.patient.records.map((record, index) => (
                  <li key={index}>{record}</li>
                ))}
              </ul>
              <md-outlined-text-field label="Nový záznam" value={this.newRecord} onInput={(e: any) => (this.newRecord = e.target.value)}></md-outlined-text-field>
              <md-filled-button onClick={() => this.addRecord()}>Pridať záznam</md-filled-button>
            </section>
          </div>
        </div>
      </Host>
    );
  }
}
