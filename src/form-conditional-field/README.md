# sergiosgc-js/form-conditional-field

Form-conditional-field handles field activation based on the values of other fields in a form.

# Usage

## Actions applied to target inputs

Managed inputs that are considered active will:

- Have the `disabled` attribute removed
- Have `disabled` CSS class removed.

conversely, inputs considered inactive will:

- Have the `disabled` attribute set
- Have `disabled` added to their class list.

## Simple equality test based on attributes

Add, to the input you wish to manage, a data attribute `data-conditional-on-value` with the format `<input_name>=<value_to_test>`. For example:

```
<form>
 <select name="contact_phone">
  <option value="landline">Landline</option>
  <option value="mobile">Cell phone</option>
 </select>
 <input type="tel" name="phone" data-conditional-on-value="contact_phone=landline">
 <input type="tel" name="mobile_phone" data-conditional-on-value="contact_phone=mobile">
</form>
```

You may test more than one field. The condition will be true if all fields pass the equality test. `data-conditional-on-value` format is the same, with conditions separated by `;`: `<input_name_a>=<value_to_test_a>;<input_name_b>=<value_to_test_b>;<input_name_c>=<value_to_test_c>;`. Example usage:

```
<form>
 <select name="include_contact_info">
  <option value="true">Yes</option>
  <option value="false">No</option>
 </select>
 <select name="contact_phone">
  <option value="landline">Landline</option>
  <option value="mobile">Cell phone</option>
 </select>
 <input type="tel" name="phone" data-conditional-on-value="include_contact_info=true;contact_phone=landline">
 <input type="tel" name="mobile_phone" data-conditional-on-value="include_contact_info=true;contact_phone=mobile">
</form>
```

## Advanced usage

For more advanced scenarios, instantiate the `FormConditionalField` class. For the constructor call you will need:

- The `form` HTMLElement
- The name of the input to be enabled/disabled
- The names of the inputs to be evaluated
- A callback function to evaluate, which returns true if the field is to be enabled. The function receives as arguments the values of the evaluated inputs

Example usage:

```
<form id="example">
 <input type="range" min="0" max="10" name="satisfaction_level">
 <textarea name="complaints">
</form>
<script>
new sergiosgc.FormConditionalField(
    document.getElementById("example"),
    "complaints",
    ["satisfaction_level"],
    (satisfaction_level) => satisfaction_level < 5
);
</script>
```
