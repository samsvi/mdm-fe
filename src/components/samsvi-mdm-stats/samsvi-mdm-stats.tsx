import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-stats',
  styleUrl: 'samsvi-mdm-stats.css',
  shadow: true,
})
export class SamsviMdmStats {
  @Prop() totalPatients: number;
  @Prop() mildPatients: number;
  @Prop() stablePatients: number;
  @Prop() criticalPatients: number;
  @Prop() isMobileView: boolean;

  render() {
    return (
      <Host>
        <div class={`stats-cards ${this.isMobileView ? 'mobile-view' : ''}`}>
          <div class="stat-card">
            <div class="stat-info">
              <h2>{this.totalPatients}</h2>
              <p>Total patients</p>
            </div>
            <md-standard-icon-button class="icon-total">
              <md-icon>people</md-icon>
            </md-standard-icon-button>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <h2>{this.mildPatients}</h2>
              <p>Mild patients</p>
            </div>
            <md-standard-icon-button class="icon-mild">
              <md-icon>healing</md-icon>
            </md-standard-icon-button>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <h2>{this.stablePatients}</h2>
              <p>Stable patients</p>
            </div>
            <md-standard-icon-button class="icon-stable">
              <md-icon>check_circle</md-icon>
            </md-standard-icon-button>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <h2>{this.criticalPatients}</h2>
              <p>Critical patients</p>
            </div>
            <md-standard-icon-button class="icon-critical">
              <md-icon>warning</md-icon>
            </md-standard-icon-button>
          </div>
        </div>
      </Host>
    );
  }
}
