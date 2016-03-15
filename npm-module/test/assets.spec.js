import expect from 'expect';
import AppGrid from '../dist/index.js';

describe('Assets API Tests', () => {
  it('Assets API should exist and contain the expected functions', () => {
    expect(typeof AppGrid.assets).toBe('object');
    expect(typeof AppGrid.assets.getAllAssets).toBe('function');
    expect(typeof AppGrid.assets.getAssetStreamById).toBe('function');
  });

  // TODO JASON: Finish updating this file

  // it('should create RECEIVE_ITEM action', () => {
  //   const receiveItemAction = itemsActions.receiveItem('itemId');
  //   expect(receiveItemAction.type).toEqual(RECEIVE_ITEM);
  //   expect(receiveItemAction.payload).toBeA(Promise);
  // });

  // const getAllAssets = () => {
  //   logExampleHeader('Requesting all assets from AppGrid');
  //   return AppGrid.assets.getAllAssets(appGridOptions)
  //     .then((assets) => {
  //       console.log('\t\t Successfully requested all assets from AppGrid', assets);
  //     })
  //     .catch((error) => {
  //       logError('Oops! There was an error while requesting all assets from AppGrid!', error);
  //     });
  // };
  //
  // const getAssetStreamById = () => {
  //   logExampleHeader('Downloading asset by id from AppGrid');
  //   const idToDownload = '5566b04e95a0d55dee44bb0001a5109c7b9be597f66ddfd5'; // NOTE: You can get a list of all assets including their IDs by calling the 'getAllAssets' API
  //   const fileName = `${downloadsDirectoryName}/favicon.png`;
  //   return AppGrid.assets.getAssetStreamById(idToDownload, appGridOptions)
  //     .then((assetStream) => {
  //       return new Promise((resolve, reject) => {
  //         existsSync(downloadsDirectoryName) || mkdirSync(downloadsDirectoryName);
  //         assetStream.pipe(createWriteStream(fileName))
  //           .on('close', resolve)
  //           .on('error', reject);
  //       });
  //     })
  //     .then(() => {
  //       console.log(`\t\t Successfully downloaded an asset by id from AppGrid.\n\t\t AssetId used: ${chalk.blue(idToDownload)}.\n\t\t Filename: ${chalk.blue(fileName)}`);
  //     })
  //     .catch((error) => {
  //       logError('Oops! There was an error while downloading an asset by id from AppGrid!', error);
  //     });
  // };
});
