var jsPsychPluginHoverDefinitions = (function (jspsych) {
  "use strict";

  const info = {
    name: "plugin-hover-definitions",
    version: "0.1.0", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
    parameters: {
      /** The text content to be displayed. Words that should have hover definitions should be marked with the 'data-hover' attribute. */
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        default: undefined,
      },
      /** The language/locale code to use for fetching culturally appropriate synonyms (e.g., 'en-US', 'es-MX'). */
      locale: {
        type: jspsych.ParameterType.STRING,
        default: 'en-US',
      },
      /** API endpoint for fetching word definitions and synonyms. */
      api_endpoint: {
        type: jspsych.ParameterType.STRING,
        default: 'https://api.dictionaryapi.dev/api/v2/entries/en/',
      },
      /** CSS styling for the tooltip that appears on hover. */
      tooltip_style: {
        type: jspsych.ParameterType.STRING,
        default: 'background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 300px; position: absolute; z-index: 1000;',
      },
    },
    data: {
      /** The text content that was displayed. */
      stimulus: {
        type: jspsych.ParameterType.STRING,
      },
      /** Words that were hovered over during the trial. */
      hovered_words: {
        type: jspsych.ParameterType.OBJECT,
      },
      /** The language/locale that was used. */
      locale: {
        type: jspsych.ParameterType.STRING,
      },
      // When working in a Javascript environment with no build, you will need to manually put the citations information.
      // You may find it useful to fill in the CITATION.cff file generated with this package and use this script to generate your citations:
      // https://github.com/jspsych/jsPsych/blob/main/packages/config/generateCitations.js
      // This is helpful for users of your plugin to easily cite it.
      citations: '__CITATIONS__', // prettier-ignore
    },
  };

  /**
   * **plugin-hover-definitions**
   *
   * A jsPsych plugin that provides hover-over definitions and culturally appropriate synonyms for words.
   *
   * @author Franchesca Pichardo
   * @see {@link /plugin-jspych-trial/README.md}
   */
  class HoverDefinitionsPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    async trial(display_element, trial) {
      // Store words that were hovered over
      const hoveredWords = {};

      // Create a div to hold the tooltip
      const tooltipDiv = document.createElement('div');
      tooltipDiv.id = 'jspsych-hover-tooltip';
      tooltipDiv.style.cssText = trial.tooltip_style;
      tooltipDiv.style.display = 'none';
      document.body.appendChild(tooltipDiv);

      // Display the stimulus
      display_element.innerHTML = `<div class="jspsych-hover-definitions-stimulus">${trial.stimulus}</div>`;

      // Find all elements with data-hover attribute
      const hoverableElements = display_element.querySelectorAll('[data-hover]');

      // Add event listeners to each hoverable element
      hoverableElements.forEach(element => {
        element.style.textDecoration = 'underline dotted';
        element.style.cursor = 'help';

        element.addEventListener('mouseenter', async (e) => {
          const word = e.target.textContent.trim().toLowerCase();

          // Record that this word was hovered over
          if (!hoveredWords[word]) {
            hoveredWords[word] = { count: 0, timestamps: [] };
          }
          hoveredWords[word].count++;
          hoveredWords[word].timestamps.push(performance.now());

          // Position the tooltip near the word
          const rect = e.target.getBoundingClientRect();
          tooltipDiv.style.left = `${rect.left}px`;
          tooltipDiv.style.top = `${rect.bottom + window.scrollY + 5}px`;

          // Show loading state
          tooltipDiv.innerHTML = 'Loading...';
          tooltipDiv.style.display = 'block';

          try {
            // Fetch definition and synonyms from API
            const response = await fetch(`${trial.api_endpoint}${word}`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
              let tooltipContent = '<div class="jspsych-hover-tooltip-content">';

              // Add definitions
              if (data[0].meanings && data[0].meanings.length > 0) {
                tooltipContent += '<h3>Definition:</h3>';
                tooltipContent += '<ul>';
                // Get the first definition from the first part of speech
                const definition = data[0].meanings[0].definitions[0].definition;
                tooltipContent += `<li>${definition}</li>`;
                tooltipContent += '</ul>';
              }

              // Add synonyms
              if (data[0].meanings && data[0].meanings.length > 0 && 
                  data[0].meanings[0].synonyms && data[0].meanings[0].synonyms.length > 0) {
                tooltipContent += '<h3>Synonyms:</h3>';
                tooltipContent += '<ul>';
                // Get up to 3 synonyms
                const synonyms = data[0].meanings[0].synonyms.slice(0, 3);
                synonyms.forEach(synonym => {
                  tooltipContent += `<li>${synonym}</li>`;
                });
                tooltipContent += '</ul>';
              }

              tooltipContent += '</div>';
              tooltipDiv.innerHTML = tooltipContent;
            } else {
              tooltipDiv.innerHTML = 'No definition found';
            }
          } catch (error) {
            console.error('Error fetching definition:', error);
            tooltipDiv.innerHTML = 'Error loading definition';
          }
        });

        element.addEventListener('mouseleave', () => {
          // Hide the tooltip when mouse leaves the word
          tooltipDiv.style.display = 'none';
        });
      });

      // Add a button to end the trial
      const buttonDiv = document.createElement('div');
      buttonDiv.innerHTML = '<button id="jspsych-hover-definitions-next" class="jspsych-btn">Continue</button>';
      buttonDiv.style.marginTop = '20px';
      display_element.appendChild(buttonDiv);

      document.getElementById('jspsych-hover-definitions-next').addEventListener('click', () => {
        // Remove the tooltip div
        if (document.body.contains(tooltipDiv)) {
          document.body.removeChild(tooltipDiv);
        }

        // End trial
        this.jsPsych.finishTrial({
          stimulus: trial.stimulus,
          hovered_words: hoveredWords,
          locale: trial.locale
        });
      });
    }
  }
  HoverDefinitionsPlugin.info = info;

  return HoverDefinitionsPlugin;
})(jsPsychModule);
