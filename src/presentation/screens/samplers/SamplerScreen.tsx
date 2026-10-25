import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { EntityItem, IconButton, screenStyles } from '@presentation/components';
import { useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { SamplerForm } from './SamplerForm';
import { getSamplerDetailsText } from './samplerDetails';
import { initialSamplerForm, submitSampler, toSamplerFormState, validateSamplerForm } from './samplerForm';

export function SamplerScreen () {
  const { getSamplers, getSampler, createSampler, editSampler, eraseSampler, alert } = useControllers();

  const screen = useEntityScreen({
    fetch: () => getSamplers.handle(),
    load: id => getSampler.handle({ id }),
    submit: form => submitSampler(form, createSampler, editSampler),
    erase: id => eraseSampler.handle({ id }),
    toFormState: toSamplerFormState,
    initialForm: initialSamplerForm,
    validate: validateSamplerForm,
    entityName: 'sampler',
    alert,
  });

  const renderList = () => {
    if (screen.isError) {
      return <Text style={screenStyles.errorText}>Failed to load samplers.</Text>;
    }
    if (screen.isLoading) {
      return <Text style={screenStyles.loadingText}>Loading...</Text>;
    }
    if (screen.entities.length === 0) {
      return <Text style={screenStyles.emptyText}>No samplers found.</Text>;
    }
    return screen.entities.map(sampler => (
      <EntityItem
        key={sampler.id}
        name={sampler.name}
        details={getSamplerDetailsText(sampler)}
        actions={!sampler.systemDefault && (
          <>
            <IconButton icon={Pencil} accessibilityLabel="Edit" onPress={() => screen.openEdit(sampler)} />
            <IconButton icon={Trash2} accessibilityLabel="Delete" onPress={() => screen.eraseEntity(sampler)} />
          </>
        )}
      />
    ));
  };

  return (
    <View style={screenStyles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
        {renderList()}

        <TouchableOpacity style={screenStyles.addButton} onPress={screen.openAdd}>
          <Text style={screenStyles.addButtonText}>Add Sampler</Text>
        </TouchableOpacity>

        {screen.showForm && (
          <SamplerForm
            formData={screen.form}
            formErrors={screen.formErrors}
            onChange={screen.updateField}
            onCancel={screen.closeForm}
            onSave={screen.save}
          />
        )}
      </ScrollView>
    </View>
  );
}
