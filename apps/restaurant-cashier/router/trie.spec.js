import { test } from 'zora';
import { createTrie } from './trie.js';

test('trie#search: simple match', (t) => {
  const trie = createTrie();
  trie.insert('foo/bar/bim');
  trie.insert('foo/bar/what');
  trie.insert('woot/blah');
  t.eq(trie.search('foo/bar/bim'), { match: 'foo/bar/bim' });
  t.eq(trie.search('foo/bar/what'), { match: 'foo/bar/what' });
  t.eq(trie.search('foo/bar/blah'), { match: '' });
  t.eq(trie.search('foo/bar'), { match: 'foo/bar' });
  t.eq(trie.search('woot/blah'), { match: 'woot/blah' });
  t.eq(trie.search('woot/blah/bim'), { match: '' });
  t.eq(trie.search('plop'), { match: '' });
});
