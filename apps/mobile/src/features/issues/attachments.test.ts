import { getPickedAttachmentName } from './attachments';

describe('getPickedAttachmentName', () => {
  it('returns the first selected filename for filename-only attachment mode', () => {
    expect(
      getPickedAttachmentName([{ name: 'test_blank_.docx' }]),
    ).toBe('test_blank_.docx');
  });

  it('returns an empty string when no file is selected', () => {
    expect(getPickedAttachmentName(undefined)).toBe('');
  });
});
