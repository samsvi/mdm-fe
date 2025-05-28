import { newSpecPage } from '@stencil/core/testing';
import { SamsviMdmRecordModal } from '../samsvi-mdm-record-modal';

describe('samsvi-mdm-record-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SamsviMdmRecordModal],
      html: `<samsvi-mdm-record-modal></samsvi-mdm-record-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <samsvi-mdm-record-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </samsvi-mdm-record-modal>
    `);
  });
});
