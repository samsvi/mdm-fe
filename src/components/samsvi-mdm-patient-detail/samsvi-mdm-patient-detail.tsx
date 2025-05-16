import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-patient-detail',
  styleUrl: 'samsvi-mdm-patient-detail.css',
  shadow: true,
})
export class SamsviMdmPatientDetail {
  @Prop() patientId: string;
  @Event() close: EventEmitter<void>;

  render() {
    return (
      <Host>
        <h2>Patient Detail</h2>
        <p>Patient ID: {this.patientId}</p>
        <button onClick={() => this.close.emit()}>Back to list</button>
      </Host>
    );
  }
}
