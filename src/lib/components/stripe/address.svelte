<script lang="ts">
  import type {
    StripeAddressElementOptions,
    StripeElements,
  } from "@stripe/stripe-js";

  import SubmitButton from "./submitBtn.svelte";

  import { onMount } from "svelte";
  import type { SideButtons, SubmissionState } from "./shared";

  export let elements: StripeElements;
  export let options: StripeAddressElementOptions = { mode: "billing" };
  export let submissionState: SubmissionState;
  export let submitText: string;
  export let hidden: boolean;

  export let sideButtons: SideButtons;

  let wrapper: HTMLElement;

  onMount(() => {
    const el = elements.create("address", options);
    el.mount(wrapper);

    return () => el.destroy();
  });
</script>

<form on:submit|preventDefault id="addressForm" class:hidden>
  <div bind:this={wrapper} />
  <SubmitButton {submissionState} {submitText} {sideButtons} />
</form>
