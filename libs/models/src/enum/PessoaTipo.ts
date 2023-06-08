
enum PessoaTipo {
  FISICA = 'F',
  JURIDICA = 'J',
  S = 'S',
  C = 'C',
  P = 'S',
  D = 'D',
  V = 'V',
  MASCULINO = 'M',
  FEMININO = 'F',
}

namespace PessoaTipo {
  export function values(): PessoaTipo[] {
    return ['Física', 'Jurídica'] as unknown as PessoaTipo[];
  }

  export function getTipoPessoa(pessoa: PessoaTipo): string {
    switch (pessoa) {
      case PessoaTipo.FISICA: return 'Física';
      case PessoaTipo.JURIDICA: return 'Jurídica';
    }
  }

  export function getSexo(pessoa: PessoaTipo): string {
    switch (pessoa) {
      case PessoaTipo.MASCULINO: return 'Masculino';
      case PessoaTipo.FEMININO: return 'Feminino';
    }
  }

  export function getEstadoCivil(pessoa: PessoaTipo): string {
    switch (pessoa) {
      case PessoaTipo.S: return 'Solteiro';
      case PessoaTipo.C: return 'Casado';
      case PessoaTipo.P: return 'Separado';
      case PessoaTipo.D: return 'Divorciado';
      case PessoaTipo.V: return 'Viúvo';
      default: return '';
    }
  }
}

export default PessoaTipo;
