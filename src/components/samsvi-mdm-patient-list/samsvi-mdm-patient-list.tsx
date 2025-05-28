import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-patient-list',
  styleUrl: 'samsvi-mdm-patient-list.css',
  shadow: true,
})
export class SamsviMdmPatientList {
  render() {
    return (
      <Host>
        <div class="waccare-container">
          <samsvi-mdm-sidebar></samsvi-mdm-sidebar>
          <samsvi-mdm-main-content></samsvi-mdm-main-content>
        </div>
      </Host>
    );
  }
}
