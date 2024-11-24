import plugins from 'phantomaton-plugins';
import persistence from 'phantomaton-persistence';

import Filesystem from './filesystem.js';

export default plugins.create(({ configuration }) => [
  plugins.define(persistence.storage).as(
    new Filesystem(configuration.directory || 'data/files')
  )
]);
