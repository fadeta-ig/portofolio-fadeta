import assert from 'node:assert/strict';
import test from 'node:test';
import {
  darkTheme,
  lightTheme,
  readStoredTheme,
  resolveTheme,
  themeStorageKey,
  writeStoredTheme
} from '../src/lib/theme.js';

test('theme tersimpan lebih diprioritaskan daripada preferensi sistem', () => {
  assert.equal(resolveTheme({ storedTheme: darkTheme, prefersDark: false }), darkTheme);
  assert.equal(resolveTheme({ storedTheme: lightTheme, prefersDark: true }), lightTheme);
  assert.equal(resolveTheme({ storedTheme: null, prefersDark: true }), darkTheme);
  assert.equal(resolveTheme({ storedTheme: null, prefersDark: false }), lightTheme);
});

test('storage theme memvalidasi nilai dan aman ketika browser menolak akses', () => {
  const values = new Map([[themeStorageKey, darkTheme]]);
  const storage = {
    getItem: (key) => values.get(key),
    setItem: (key, value) => values.set(key, value)
  };

  assert.equal(readStoredTheme(storage), darkTheme);
  assert.equal(writeStoredTheme(lightTheme, storage), true);
  assert.equal(readStoredTheme(storage), lightTheme);
  assert.equal(readStoredTheme({ getItem: () => 'unknown' }), null);
  assert.equal(readStoredTheme({ getItem: () => { throw new Error('blocked'); } }), null);
  assert.equal(writeStoredTheme(darkTheme, { setItem: () => { throw new Error('blocked'); } }), false);
});
