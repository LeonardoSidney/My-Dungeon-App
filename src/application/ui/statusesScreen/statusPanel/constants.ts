import { Status } from '@domain/entities';

export interface StatusPanelProps {
  statuses: Status[];
  onEdit: (status: Status) => void;
  onDelete: (status: Status) => Promise<void>;
}
