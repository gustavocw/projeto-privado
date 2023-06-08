type TEstadoCivil = 'S' | 'C' | 'P' | 'D' | 'V';
type TSexo = 'M' | 'F';

enum PessoaTipo {
  FISICA = 'F',
  JURIDICA = 'J',
  ESTADO_CIVIL = 'ESTADO_CIVIL',
  SEXO = 'SEXO'
}

namespace PessoaTipo {
  export function values(): PessoaTipo[] {
    return Object.values(PessoaTipo)
        .filter((value) => typeof value === 'number')
        .map((value) => value as PessoaTipo);
  }

  export function getTipoPessoa(tipo: PessoaTipo): string {
    if (tipo === null) return '';

    return tipo === PessoaTipo.FISICA ? 'Física' : 'Jurídica';
  }

  export function getSexo(sexo: TSexo): string {
    if (sexo === null) return '';

    return sexo === 'M' ? 'Masculino' : 'Feminino';
  }

  export function getEstadoCivil(estadoCivil: TEstadoCivil): string {
    if (estadoCivil === null) return '';

    switch (estadoCivil) {
      case 'S': return 'Solteiro';
      case 'C': return 'Casado';
      case 'P': return 'Separado';
      case 'D': return 'Divorciado';
      case 'V': return 'Viúvo';
      default: return '';
    }
  }
}

export default PessoaTipo;
