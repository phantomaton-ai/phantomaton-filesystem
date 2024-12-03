import { expect, stub } from 'lovecraft';
import hierophant from 'hierophant';
import { promises as fs } from 'fs';
import path from 'path';

import persistence from 'phantomaton-persistence';
import filesystem from './phantomaton-filesystem.js';
import Filesystem from './filesystem.js';

describe('Phantomaton Filesystem Plugin', () => {
  let container;

  beforeEach(() => {
    container = hierophant();
    container.install(filesystem.plugin());
  });

  it('provides the storage extension point', () => {
    const [getStorage] = container.resolve(persistence.storage.resolve);
    expect(getStorage).to.be.a('function');
  });

  it('uses the Filesystem provider', async () => {
    const [getStorage] = container.resolve(persistence.storage.resolve);
    const storage = await getStorage();
    expect(storage).to.be.an.instanceOf(Filesystem);
  });

  it('loads and saves data using the Filesystem provider', async () => {
    const [getStorage] = container.resolve(persistence.storage.resolve);
    const storage = await getStorage();

    const readFileStub = stub(fs, 'readFile').resolves(JSON.stringify({ id: 'test', data: 'test-data' }));
    const writeFileStub = stub(fs, 'writeFile').resolves();

    const loaded = await storage.load('test');
    expect(loaded).to.deep.equal({ id: 'test', data: 'test-data' });
    expect(readFileStub).to.have.been.calledWith(path.join('data/files', 'test.json'), 'utf-8');

    const saved = await storage.save('test', { id: 'test', data: 'updated-data' });
    expect(saved).to.deep.equal({ id: 'test', data: 'updated-data' });
    expect(writeFileStub).to.have.been.calledWith(path.join('data/files', 'test.json'), JSON.stringify({ id: 'test', data: 'updated-data' }));
  });

  it('uses the configured directory', async () => {
    const customFilesystem = filesystem.plugin({
      configuration: {
        directory: 'custom/path'
      }
    });

    container.install(customFilesystem);
    const [getStorage] = container.resolve(persistence.storage.resolve);
    const storage = await getStorage();
    expect(storage).to.be.an.instanceOf(Filesystem);
    expect(storage.directory).to.equal('custom/path');
  });
});