/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { setLibs } from './utils.js';

// Add project-wide styles here.
const STYLES = '';

const LIBS = '/libs';

// Add any config options.
const CONFIG = {
  codeRoot: '/hub',
  contentRoot: '/hub',
  imsClientId: 'DocumentCloud1', // This will need to change per hub.
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
  },
};

// Default to loading the first image as eager.
(async function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.setAttribute('loading', 'eager');
}());

/*
 * ------------------------------------------------------------
 * FedsPub
 * ------------------------------------------------------------
 */


const blocks = {
  callout: {
      css: '/hub/blocks/callout/callout.css',
  }
};

function debug(msg) {
  if (new URLSearchParams(window.location.search).has('debug')) {
      console.log(msg);
  }
}

function loadCSS(config = {}) {
  if (!config.path || document.querySelector(`head > link[href='${config.path}']`)) {
      return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = config.path;
  document.head.append(link);
}

async function loadBlock(block) {
  if (!block.getAttribute('data-block-loaded')) {
      const name = block.getAttribute('data-block-name');
      if (!name) {
          return;
      }
      if (!block.classList.contains("callout")) {
          return;
      }

      const config = blocks["callout"];
      try {
          if (config.css) {
              loadCSS({
                  path: config.css,
              });
          }
      } catch (e) {
          debug(`failed to load block ${name}`, config);
      }
  }
}

function loadBlocks() {
  document.querySelectorAll('main > div.block')
      .forEach(async (block) => loadBlock(block));
}

function decorateBlock(block) {
  const name = block.classList[0];
  if (!name) {
      return;
  }

  block.classList.add('block');
  block.setAttribute('data-block-name', name);
}

function decorateBlocks() {
  document.querySelectorAll('main .section.callout').forEach(decorateBlock);
}



/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

const miloLibs = setLibs(LIBS);

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

const { loadArea, loadDelayed, setConfig } = await import(`${miloLibs}/utils/utils.js`);

(async function loadPage() {
  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
  loadDelayed();
  decorateBlocks();
  await loadBlocks();
}());
