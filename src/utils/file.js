import { Image, Paperclip, Slash } from 'react-feather';
import {
  validDocumentExtensions,
  validImagesExtentions,
} from '../constants/extensions';

const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

export const getFileTypeIcon = (fileName) => {
  const extension = getFileExtension(fileName);
  if (validImagesExtentions.includes(extension)) {
    return <Image color='#570097' />;
  }

  if (validDocumentExtensions.includes(extension)) {
    return <Paperclip color='#570097' />;
  }

  return <Slash color='#570097' />;
};
