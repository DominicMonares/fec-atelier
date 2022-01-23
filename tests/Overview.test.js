/**
 * @jest-environment jsdom
 */

import axios from 'axios';
import React from 'react';
import 'regenerator-runtime/runtime.js';
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import Fetch from 'fetch'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';


import productData from './samples/sample-overview-data.js';
import styleData from './samples/sample-overview-data.js';
import Overview from '../client/src/components/Overview/Overview.jsx';
import AddToCart from '../client/src/components/Overview/components/AddToCart.jsx';
import ImageGallery from '../client/src/components/Overview/components/ImageGallery.jsx';
import ProductInfo from '../client/src/components/Overview/components/ProductInfo.jsx';
import StyleSelector from '../client/src/components/Overview/components/StyleSelector.jsx';

jest.mock('axios');
// beforeAll((done) => {
//   done();
// })

// afterAll((done) => {
//   done();
// })

xdescribe('Overview', function() {

  describe('Render Overview Widget', function() {

    test('should Render the Overview Component', function() {
      // axios.get.mockResolvedValueOnce(productData);
      render(<Overview itemid={59557}/>);
      const OverviewElement = screen.getByTestId('overview-widget');
      expect(OverviewElement).toBeInTheDocument();
    })

    test('should Render the AddToCart Component', function() {
      render(<AddToCart />);
      const AddToCartElement = screen.getByTestId('add-to-cart');
      expect(AddToCartElement).toBeInTheDocument();
    })

    test('should Render the ImageGallery Component', function() {
      render(<ImageGallery />);
      const ImageGalleryElement = screen.getByTestId('image-gallery');
      expect(ImageGalleryElement).toBeInTheDocument();
    })

    test('should Render the ProductInfo Component', function() {
      render(<ProductInfo />);
      const ProductInfoElement = screen.getByTestId('product-info');
      expect(ProductInfoElement).toBeInTheDocument();
    })

    test('should Render the StyleSelector Component', function() {
      render(<StyleSelector />);
      const StyleSelectorElement = screen.getByTestId('style-selector');
      expect(StyleSelectorElement).toBeInTheDocument();
    })
  })
})
