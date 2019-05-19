import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';

export const nodes: Node[] = [
  {
    id: '1',
    label: 'Moves'
  }, {
    id: '2',
    label: '?? (Blunder)'
  }, {
    id: '3',
    label: '? (Mistake)'
  }, {
    id: '4',
    label: '?! (Dubious move)'
  }, {
    id: '5',
    label: '!? (Interesting move)'
  }, {
    id: '6',
    label: '! (Good move)'
  }, {
    id: '7',
    label: '‼ (Brilliant move)'
  }, {
    id: '8',
    label: 'Positions '
  }, {
    id: '9',
    label: '= (Equal)'
  }, {
    id: '10',
    label: '+/= or ⩲ (Slight plus for White)'
  }, {
    id: '11',
    label: '=/+ or ⩱ (Slight plus for Black)'
  }, {
    id: '12',
    label: '+/− or ± (Clear plus for White)'
  }, {
    id: '13',
    label: '−/+ or ∓ (Clear plus for Black)'
  }, {
    id: '14',
    label: '+ − (Decisive advantage for White)'
  }, {
    id: '15',
    label: '− + (Decisive advantage for Black)'
  }, {
    id: '16',
    label: '∞ (Unclear)'
  }, {
    id: '17',
    label: '=/∞ (Compensation)'
  }
];

export const clusters: ClusterNode[] = [
  /*{
    id: 'third',
    label: 'C',
    childNodeIds: ['c1', 'c2']
  }*/
]

export const links: Edge[] = [
  {
    id: 'a',
    source: '2',
    target: '1',
  }, {
    id: 'b',
    source: '3',
    target: '1',
  }, {
    id: 'c',
    source: '4',
    target: '1',
  }, {
    id: 'd',
    source: '5',
    target: '1',
  }, {
    id: 'e',
    source: '6',
    target: '1',
  }, {
    id: 'f',
    source: '7',
    target: '1',
  }, {
    id: 'g',
    source: '9',
    target: '8',
  }, {
    id: 'h',
    source: '10',
    target: '8',
  }, {
    id: 'i',
    source: '11',
    target: '8',
  }, {
    id: 'j',
    source: '12',
    target: '8',
  }, {
    id: 'k',
    source: '13',
    target: '8',
  }, {
    id: 'l',
    source: '14',
    target: '8',
  }, {
    id: 'm',
    source: '15',
    target: '8',
  }, {
    id: 'n',
    source: '16',
    target: '8',
  }, {
    id: 'o',
    source: '17',
    target: '8',
  }
];

/*{
    id: 'e',
    source: 'c3',
    target: 'c3',
    label: 'loop'
  }*/