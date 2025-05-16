import { Component, Host, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'samsvi-mdm-app',
  styleUrl: 'samsvi-mdm-app.css',
  shadow: true,
})
export class SamsviMdmApp {
  @State() private relativePath = '';

  @Prop() basePath: string = '';

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length).replace(/^\/+/, '');
      } else {
        this.relativePath = '';
      }
    };

    window.navigation?.addEventListener('navigate', (ev: Event) => {
      if ((ev as any).canIntercept) {
        (ev as any).intercept();
      }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname);
  }

  private navigate(path: string) {
    const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
    window.navigation?.navigate(absolute);
  }

  render() {
    const isPatientDetail = this.relativePath.startsWith('patient/');
    const patientId = isPatientDetail ? this.relativePath.split('/')[1] : null;

    return (
      <Host>
        {isPatientDetail ? (
          <samsvi-mdm-patient-detail id={patientId} onClose={() => this.navigate('/')}></samsvi-mdm-patient-detail>
        ) : (
          <samsvi-mdm-patient-list></samsvi-mdm-patient-list>
        )}
      </Host>
    );
  }
}
