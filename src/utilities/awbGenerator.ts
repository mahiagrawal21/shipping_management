import { v4 as uuidv4 } from 'uuid';

export function generateAwbNumber(): string {
  return `AWB-${uuidv4()}`;
}
