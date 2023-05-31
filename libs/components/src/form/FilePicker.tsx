import React, {useCallback, useEffect} from 'react';
import FormInput from './FormInput';
import {observer, useLocalStore} from 'mobx-react';
import {InputAdornment, TextField} from '@material-ui/core';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import PublishIcon from '@material-ui/icons/Publish';
import Utils from '@alkord/shared/utils/Utils';

interface Props extends FormInput<string> {
  label: string;
  extensoesValidas: string[],
}

const FilePicker: React.FC<Props> = (props: Props) => {
  const {
    label,
    value,
    onChange,
    error,
    helperText,
    required,
    disabled,
    extensoesValidas,
  } = props;

  const store = useLocalStore(() => ({
    id: `_filepicker_${Utils.gerarIdUnico()}`,
    value,
    file: null as File,
    error: error ? helperText : null,
  }));

  const fileSelected = !!value;

  const onChangeValue = useCallback(async () => {
    store.value = store.file ? Utils.arrayBufferToBase64(await store.file.arrayBuffer()) : null;
    onChange(store.value);
  }, [store.file, store.value]);

  useEffect(() => {
    onChangeValue();
  }, [store.file]);

  useEffect(() => {
    if (value !== store.value) {
      store.value = value;
      store.file = null;
    }
  }, [value]);

  useEffect(() => {
    store.error = error ? helperText : null;
  }, [store, error, helperText]);

  const isExtensaoValida = (extensao: string) => {
    return extensoesValidas
        .map((extensaoValida) => extensaoValida.toUpperCase())
        .includes(extensao.toUpperCase());
  };

  const onFileSelect = useCallback((files: FileList) => {
    if (!files[0]) {
      store.error = null;
      store.file = null;
      return;
    }

    try {
      const file = files[0];

      const extensao = file.name.split('.').pop();
      if (isExtensaoValida(extensao)) {
        store.error = null;
        store.file = file;
      }
      else {
        store.error = 'Extensão do arquivo inválida';
      }
    }
    catch (e) {
      store.error = 'Erro ao selecionar o arquivo';
    }
  }, [store]);

  const onSelect = useCallback(() => {
    if (disabled || fileSelected) return;

    const input = document.getElementById(store.id) as HTMLInputElement;
    input.value = '';
    input.click();
  }, [fileSelected, store.id, store.file, disabled]);

  const onClickIcon = useCallback(() => {
    if (disabled) return;

    if (fileSelected) {
      store.file = null;
    }
    else {
      onSelect();
    }
  }, [fileSelected, store.file, disabled]);

  return (
    <>
      <input
        id={store.id}
        disabled={fileSelected}
        onChange={(e) => onFileSelect(e.target.files)}
        accept={extensoesValidas.map((extensao) => '.' + extensao).join(',')}
        multiple={false}
        type="file"
        hidden
      />
      <TextField
        label={required ? `${label} *` : label}
        value={fileSelected ? (store.file ? store.file.name : 'Arquivo selecionado') : 'Selecione o arquivo'}
        error={!!store.error}
        helperText={store.error || helperText}
        InputProps={{
          onClick: fileSelected ? null : onSelect,
          inputProps: {
            style: fileSelected ? null : {cursor: 'pointer'},
            disabled: true,
          },
          endAdornment: (
            <InputAdornment
              position="end"
              style={disabled ? null: {cursor: 'pointer'}}
              onClick={disabled ? null : onClickIcon}
            >
              {fileSelected ? (
              <CloseOutlinedIcon color={disabled ? 'disabled' : 'secondary'}/>
            ) : (
              <PublishIcon color={disabled ? 'disabled' : 'secondary'}/>
            )}
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default observer(FilePicker);
