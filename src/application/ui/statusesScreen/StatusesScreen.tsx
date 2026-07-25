import React, { useState } from 'react';
import { Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { Status } from '@domain/entities';
import { styles } from './styles';
import { StatusPanel } from './statusPanel';
import { StatusForm } from './statusForm';
import { useStatusesScreenLogic } from './useStatusesScreenLogic';
import { StatusFormData } from './constants';
import { setInitialStatusState } from './setInitialStatusState';
import { handleStatusFormChange } from './handleStatusFormChange';
import { onAddNewStatus } from './onAddNewStatus';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseStatus } from './onEraseStatus';
import { onSaveStatus } from './onSaveStatus';

export function StatusesScreen () {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [statusStateFormData, setStatusFormData] = useState<StatusFormData>(setInitialStatusState());
  const [showForm, setShowForm] = useState(false);

  useStatusesScreenLogic(setStatuses);

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Statuses</Text>
        </View>

        <StatusPanel
          statuses={statuses}
          onEdit={(status) => onEditForm(status, setShowForm, setStatusFormData)}
          onDelete={(status) => onEraseStatus(status, setStatuses)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddNewStatus(setShowForm, setStatusFormData)}
        >
          <Text style={styles.addButtonText}>Add Status</Text>
        </TouchableOpacity>

        <StatusForm
          showForm={showForm}
          statusStateFormData={statusStateFormData}
          onChange={handleStatusFormChange(setStatusFormData)}
          onCancel={() => onCancelForm(setShowForm, setStatusFormData)}
          onSave={() => onSaveStatus(statusStateFormData, setStatusFormData, setShowForm, setStatuses)}
        />

      </ScrollView>
    </View>
  );
}
