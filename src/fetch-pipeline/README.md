# sergiosgc-js/fetch-pipeline

fetch-pipeline handles the common request-transform-load pipeline for form inputs. It attaches to events in fields that affect the data source URL and executes a request-transform-load sequence whenever the URL changes.

# Usage

## Attribute based usage

On the input element that will be the target of the load action, add a `data-fetch-pipeline` attribute. The attribute has three parts, separated by a pipe: `<url>|<data_fields>|<sink_function>`

**URL**
: The URL where to fetch data when source fields change. Form field values can be included in the URL using `{field}` and brackets can be escaped using double brackets. For a form with an input named `id` with value `42`, `/user/{id}/{{name}}` is evaluated to `/user/42/{name}`

**Data fields**
: Data fields are keys into the JSON returned by the request to the URL. A field is a set of keys in dot notation. Each step must be either an object or an array of objects in the JSON. `result.success.users.id` will result in all `id`s of all `users` of the `sucess` object inside the `result` object.

You may have as many datafields as needed, separated by commas. `result.success.users.id,result.success.users.name` will produce tuples of `(id,name)` for each user in the response.

**Sink function**
: The function that will handle the load part of the pipeline. `this` in this expression, resolves to the input element that has the `data-fetch-pipeline` attribute. Otherwise, it resolves to global variables.

The function will receive as argument an array. Each array entry is a tuple with as many entries as data fields defined in the pipeline data fields section.

Example usage:

```
<script>
HTMLSelectElement.prototype.ingest_options = function(options) {
    this.innerHTML = '';
    options.forEach( [ value, label ] {
        const option = document.createElement('OPTION');
        option.setAttribute("value", value);
        option.innerHTML = label;
        this.appendChild(option);
    });
};
</script>
<form>
 <input type="text" name="id">
 <select name="car" data-fetch-pipeline="/user/{id}/available_cars/|result.cars.id,result.model|this.ingest_options">
 </select>
</form>
```

For this example, `/user/{id}/available_cars/` should return a JSON like:

```
{
    "result": {
        "cars": [
            { "id": "1", "model": "VW Beetle" },
            { "id": "2", "model": "Ford GT" },
            { "id": "3", "model": "Lancia Delta" }
        ]
    }
}
```

## Advanced usage

You may also directly use the class. You'll need these parameters for the constructor:

- **form**: The form where URL input values live
- **url**: The data fetch URL, as described above
- **extraction_function**: A function that receives the JSON resulting from the HTTP request and returns data to be fed to the sink function
- **sink_function**: The function that will handle changing the input value.
