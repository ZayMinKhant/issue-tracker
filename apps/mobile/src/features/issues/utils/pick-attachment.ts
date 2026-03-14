import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { getErrorMessage } from '@issue-tracker/utils';
import { Alert } from 'react-native';
import { getPickedAttachmentName } from './attachments';

export async function pickAttachment(
  setValue: (name: 'attachmentName', value: string, options?: { shouldDirty?: boolean; shouldValidate?: boolean }) => void,
) {
  try {
    const files = await pick({
      allowMultiSelection: false,
      mode: 'import',
      type: [types.allFiles],
    });

    setValue('attachmentName', getPickedAttachmentName(files), {
      shouldDirty: true,
      shouldValidate: true,
    });
  } catch (error) {
    if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
      return;
    }

    Alert.alert('Could not select file', getErrorMessage(error));
  }
}
