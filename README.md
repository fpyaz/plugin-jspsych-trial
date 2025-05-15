# plugin-hover-definitions

## Overview

A jsPsych plugin that provides hover-over definitions and culturally appropriate synonyms for words. This plugin is designed to help experimenters who have test subjects who may not know certain words, by providing definitions and synonyms when hovering over specific words in the text.

## Features

- Hover over words to see their definitions and synonyms
- Culturally appropriate synonyms based on locale
- Customizable tooltip styling
- Tracks which words were hovered over and how many times
- Uses a free dictionary API to fetch definitions and synonyms

## Loading

```html
<!-- Load jsPsych -->
<script src="https://unpkg.com/jspsych@7.3.1"></script>

<!-- Load the plugin -->
<script src="path/to/plugin-hover-definitions.js"></script>

<!-- Load jsPsych stylesheet -->
<link rel="stylesheet" href="https://unpkg.com/jspsych@7.3.1/css/jspsych.css">
```

## Compatibility

`plugin-hover-definitions` requires jsPsych v7.0.0 or later.

## Usage

### Basic Usage

```javascript
const hoverTrial = {
  type: jsPsychPluginHoverDefinitions,
  stimulus: `
    <p>
      The <span data-hover>ubiquitous</span> nature of technology has led to 
      <span data-hover>unprecedented</span> changes in how we communicate.
    </p>
  `,
  locale: 'en-US',
  api_endpoint: 'https://api.dictionaryapi.dev/api/v2/entries/en/'
};
```

### Parameters

| Parameter | Type | Default Value | Description |
|-----------|------|---------------|-------------|
| stimulus | string | undefined | The HTML content to display. Words that should have hover definitions should be marked with the `data-hover` attribute. |
| locale | string | 'en-US' | The language/locale code to use for fetching culturally appropriate synonyms. |
| api_endpoint | string | 'https://api.dictionaryapi.dev/api/v2/entries/en/' | API endpoint for fetching word definitions and synonyms. |
| tooltip_style | string | 'background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 300px; position: absolute; z-index: 1000;' | CSS styling for the tooltip that appears on hover. |

### Data Generated

| Name | Type | Description |
|------|------|-------------|
| stimulus | string | The HTML content that was displayed. |
| hovered_words | object | An object containing information about which words were hovered over, how many times, and timestamps. |
| locale | string | The language/locale that was used. |

## Use Cases

1. **Language Learning Experiments**: Help non-native speakers understand complex vocabulary in experimental instructions or stimuli.

2. **Educational Research**: Provide definitions for technical terms in educational materials to ensure all participants have access to the same information.

3. **Cross-Cultural Studies**: Offer culturally appropriate synonyms to ensure participants from different backgrounds understand the intended meaning.

4. **Accessibility**: Make experiments more accessible to participants with limited vocabulary or language proficiency.

5. **Reading Comprehension Studies**: Track which words participants need help with to study vocabulary difficulties.

## Example

See the `examples/index.html` file for a complete working example of the plugin.

## Author / Citation

Franchesca Pichardo
