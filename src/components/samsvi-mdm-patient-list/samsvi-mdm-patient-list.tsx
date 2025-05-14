import { Component, h } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-patient-list',
  styleUrl: 'samsvi-mdm-patient-list.css',
  shadow: true,
})
export class SamsviMdmPatientList {
  render() {
    return (
      <div class="waccare-container">
        <samsvi-mdm-sidebar></samsvi-mdm-sidebar>
        <samsvi-mdm-main-content></samsvi-mdm-main-content>
      </div>
    );
  }
}
