
enum PessoaTipo {
  FISICA = 'F',
  JURIDICA = 'J',
}

namespace PessoaTipo {
  export function values(): PessoaTipo[] {
    return Object.values(PessoaTipo)
        .filter((value) => typeof value === 'string')
        .map((value) => value as PessoaTipo);
  }

  export function getTipoPessoa(pessoa: PessoaTipo): string {
    switch (pessoa) {
      case PessoaTipo.FISICA: return 'Física';
      case PessoaTipo.JURIDICA: return 'Jurídica';
    }
  }
}

export default PessoaTipo;
