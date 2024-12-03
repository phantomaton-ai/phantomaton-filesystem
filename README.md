# Phantomaton Filesystem 💽

The Phantomaton Filesystem module provides a local file system-based storage implementation for the Phantomaton persistence layer. It allows Phantomaton projects to store and retrieve data using the local file system.

## Usage 🛠️

To use the Phantomaton Filesystem module, you'll need to install it in your Phantomaton application. This can be done by adding the following to your Phantomaton system prompt:

```
/install(module:phantomaton-filesystem)
```

Once the module is installed, you can resolve the `persistence.storage` extension point to access the file system storage provider:

```javascript
import plugins from 'phantomaton-plugins';
import persistence from 'phantomaton-persistence';

const myPlugin = plugins.create({
  // Declare that we depend on the storage extension point
  storage: persistence.storage
}, ({ extensions }) => [
  // Use the storage provider
  plugins.define(extensions.start)
    .with(extensions.storage)
    .as(async (storage) => {
      const data = await storage.load('my-data');
      console.log('Loaded data:', data);

      const updatedData = { ...data, new: 'value' };
      await storage.save('my-data', updatedData);
      console.log('Saved data:', updatedData);
    })
]);
```

## Configuration 🔧

The Phantomaton Filesystem module can be configured to use a custom directory for storing files. To do this, you can provide a `configuration` object when installing the plugin:

```javascript
const myPlugin = plugins.create({
  // Configure the filesystem plugin
  configuration: {
    directory: 'custom/path/to/files'
  }
})();

myPlugin.install.forEach(extension => container.install(extension));
```

If no configuration is provided, the module will use the `'data/files'` directory by default.

For more information on Phantomaton's configuration system, please refer to the [Phantomaton project documentation](https://github.com/phantomaton-ai/phantomaton#configuration-).

## Contributing 🦄

We welcome contributions to the Phantomaton Filesystem project! If you have any ideas, bug reports, or pull requests, please feel free to submit them on the [Phantomaton Filesystem GitHub repository](https://github.com/phantomaton-ai/phantomaton-filesystem).

## License 🔒

The Phantomaton Filesystem module is licensed under the [MIT License](LICENSE).