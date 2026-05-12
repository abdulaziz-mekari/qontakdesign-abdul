# Components

Use this file to map UI needs to Pixel components, then verify uncertain props with `get-component`.

## Mapping Guide

| UI Need              | Pixel Component                       | Notes                                               |
| -------------------- | ------------------------------------- | --------------------------------------------------- |
| Heading or body text | `MpText`                              | Check valid `size` values before setting them       |
| Icon                 | `MpIcon`                              | Check valid `name` values before setting them       |
| Action button        | `MpButton`, `MpButtonGroup`           | Validate `variant`, `size`, and icon props          |
| Text input           | `MpInput` in `MpFormControl`          | Add label, help text, and error state explicitly    |
| Textarea             | `MpTextarea` in `MpFormControl`       | Keep validation and help text close to the field    |
| Select or dropdown   | `MpSelect` in `MpFormControl`         | Verify option shape and supported slots             |
| Select with tag      | `MpInputTag`                          | Verify props and supported slots                    |
| Checkbox or radio    | `MpCheckbox`, `MpRadio`, `MpToggle`   | Preserve accessible labels and state                |
| Date picker          | `MpDatePicker` in `MpFormControl`     | Verify formatting and value contract                |
| Modal or drawer      | `MpModal`, `MpDrawer`                 | Handle open state, close action, and focus behavior |
| Tooltip or popover   | `MpTooltip`, `MpPopover`              | Use for supporting context, not core content        |
| Table                | `MpTable`                             | Validate column and row APIs                        |
| Banner or alert      | `MpBanner`                            | Use for status and critical feedback                |
| Badge or tag         | `MpBadge`, `MpTag`                    | Use documented color and variant props only         |
| Avatar or icon       | `MpAvatar`, `MpIcon`                  | Use only valid icon names                           |
| Loading state        | `MpSpinner`, `MpSkeleton`, `MpLoader` | Match loading shape to final content                |
| Layout container     | `MpFlex`, `Pixel.div`                 | Prefer these over raw layout HTML                   |

## Validation Rules

1. Run `get-component("ComponentName")` before choosing unfamiliar props.
2. Prefer documented defaults instead of force-setting every prop.
3. Resolve TypeScript errors by checking docs first, not by force-casting.
4. Keep field labeling, help text, and error messaging explicit.

## Common Traps

- Do not assume generic size values like `sm`, `md`, `lg`, or `xl`.
- Do not assume arbitrary icon names exist in the Pixel icon set.
- Do not pass numbers where the component expects strings.
- Do not skip `MpFormControl` when the field needs validation or error messaging.

## Mini Patterns

### Validated Field

```vue
<MpFormControl id="email" :is-error="isError" is-required>
  <MpFormLabel>Email</MpFormLabel>
  <MpInput v-model="email" type="email" placeholder="name@company.com" />
  <MpFormErrorMessage>Email is required</MpFormErrorMessage>
</MpFormControl>
```

### Form Validation on Submit

Validate required fields on submit click. Show errors inline — never disable the submit button to prevent submission.

**Error message wording (sentence case):**
- Text input / textarea / rich text editor: `You must enter {field name}`
- Select / dropdown / tag input: `You must select {field name}`
- Tag input with minimum count: `You must select at least {n} {field name}`

**Field name uses lowercase** — e.g. `You must select sender`, not `You must select Sender`.

**Implementation:**

```vue
<script setup lang="ts">
const errors = ref({ sender: '', recipients: '', bodyMessage: '' })

function clearError(field: keyof typeof errors.value) {
  errors.value[field] = ''
}

function validateAndSend() {
  errors.value.sender      = form.value.sender               ? '' : 'You must select sender'
  errors.value.recipients  = form.value.recipients.length > 0 ? '' : 'You must select at least 1 recipients'
  errors.value.bodyMessage = form.value.bodyMessage.trim()    ? '' : 'You must enter body message'

  if (Object.values(errors.value).some(Boolean)) return
  // submit
}
</script>

<template>
  <!-- Select field -->
  <MpFormControl :isInvalid="!!errors.sender">
    <MpFormLabel>Sender <span style="color: var(--mp-colors-text-danger)">*</span></MpFormLabel>
    <MpSelect v-model="form.sender" @change="clearError('sender')">…</MpSelect>
    <MpFormErrorMessage v-if="errors.sender">{{ errors.sender }}</MpFormErrorMessage>
  </MpFormControl>

  <!-- Tag input — pass isInvalid directly on MpInputTag, keep help text always visible -->
  <MpFormControl :isInvalid="!!errors.recipients">
    <MpFormLabel>Recipients <span style="color: var(--mp-colors-text-danger)">*</span></MpFormLabel>
    <MpInputTag :isInvalid="!!errors.recipients" @change="(tags) => { onRecipientsChange(tags); clearError('recipients') }" />
    <MpFormHelpText>Select up to 3 customers</MpFormHelpText>
    <MpFormErrorMessage v-if="errors.recipients">{{ errors.recipients }}</MpFormErrorMessage>
  </MpFormControl>

  <!-- Text input -->
  <MpFormControl :isInvalid="!!errors.bodyMessage">
    <MpFormLabel>Body message <span style="color: var(--mp-colors-text-danger)">*</span></MpFormLabel>
    <MpInput v-model="form.bodyMessage" @input="clearError('bodyMessage')" />
    <MpFormErrorMessage v-if="errors.bodyMessage">{{ errors.bodyMessage }}</MpFormErrorMessage>
  </MpFormControl>

  <MpButton variant="primary" @click="validateAndSend">Submit</MpButton>
</template>
```

**Rules:**
- Always use `MpFormControl :isInvalid` to trigger the red border on the wrapper.
- For `MpInputTag`, also pass `:isInvalid` directly on the component itself.
- Help text (`MpFormHelpText`) stays visible even when the error is showing — the error appears below it.
- Errors clear as the user corrects the field (`clearError` on `@change` / `@input`).
- Submit button is always enabled; validation runs on click.

### Modal Action Flow

```vue
<MpModal v-model="isOpen">
  <MpModalHeader>
    Confirm action
    <MpModalCloseButton />
  </MpModalHeader>
  <MpModalContent>
    <MpModalBody>
      <MpText>Review the impact before continuing.</MpText>
    </MpModalBody>
    <MpModalFooter>
      <MpButtonGroup>
        <MpButton variant="secondary" @click="isOpen = false">Cancel</MpButton>
        <MpButton variant="primary">Confirm</MpButton>
      </MpButtonGroup>
    </MpModalFooter>
  </MpModalContent>
</MpModal>
```
