import importlib.util
import json
from glob import glob

def main():
    plugins = load_plugins()

    print(plugins)

    result = plugins[0][0].tag("The dog is unleashed")

    print(result)

def load_plugins():

    plugin_dirs = glob("plugins/*/")

    plugins = []
    for dir in plugin_dirs:
        spec = importlib.util.spec_from_file_location(dir, dir + "/main.py")
        plugin = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(plugin)

        with open(dir + 'metadata.json') as metadata:
            md = json.load(metadata)
            graph_name = md['graphName']

        plugins.append((plugin, graph_name))

    return plugins

if __name__ == '__main__':
    main()