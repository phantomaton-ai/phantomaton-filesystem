import { expect, stub } from 'lovecraft';
import hierophant from 'hierophant';
import { promises as fs } from 'fs';
import path from 'path';

import persistence from 'phantomaton-persistence';
import filesystem from './phantomaton-filesystem.js';
import Filesystem from './filesystem.js';

describe('Phantomaton Filesystem Plugin', () => {
  const data = { id: 'test', data: 'test-data' };
  const update = { ...data, data: 'updated-data' };
  const options = { directory: 'custom/path' };
  let container;

  beforeEach(() => {
    const plugins = [persistence(), filesystem(options)];
    container = hierophant();
    plugins.forEach(
      plugin => plugin.install.forEach(
        extension => container.install(extension)
      )
    );
  });

  it('uses the Filesystem provider', async () => {
    const [storage] = container.resolve(persistence.storage.resolve);
    expect(storage).to.be.an.instanceOf(Filesystem);
  });

  it('loads and saves data using the Filesystem provider', async () => {
    const [storage] = container.resolve(persistence.storage.resolve);

    stub(fs, 'readFile').resolves(JSON.stringify(data));
    stub(fs, 'writeFile').resolves();

    const loaded = await storage.load('test');
    expect(loaded).to.deep.equal(data);
    expect(fs.readFile.calledWith(path.join('custom/path', 'test.json'), 'utf-8')).to.be.true;

    await storage.save('test', update);
    expect(fs.writeFile.calledWith(path.join('custom/path', 'test.json'), JSON.stringify(update))).to.be.true;
  });

  it('uses the configured directory', async () => {
    const [storage] = container.resolve(persistence.storage.resolve);
    expect(storage.directory).to.equal('custom/path');
  });
});