/**
 * @jest-environment jsdom
*/

import React from 'react';
import _ from 'underscore';
import 'regenerator-runtime/runtime.js';
import '@testing-library/jest-dom';
import {mount} from 'enzyme'
import {render, screen, cleanup, fireEvent, waitFor} from '@testing-library/react';
import {product1Data, product1DataSorted, product2Data, product2DataSorted, product3Data} from './samples/sample-qa-data.js';

import QA from '../client/src/components/QA/QA.jsx';
import ClickTracker from '../client/src/components/ClickTracker.jsx';
import AnswerList from '../client/src/components/QA/components/AnswerList.jsx';
import AnswerQuestion from '../client/src/components/QA/components/AnswerQuestion.jsx';
import Answers from '../client/src/components/QA/components/Answers.jsx';
import AskQuestion from '../client/src/components/QA/components/AskQuestion.jsx';
import Questions from '../client/src/components/QA/components/Questions.jsx';
import SearchQuestion from '../client/src/components/QA/components/SearchQuestion.jsx';

describe('Questions & Answers', function() {
  let renderProps = () => {return};

  describe('QA Component', function() {

    test('should render the QA component', function() {
      render(<QA itemid={59557} render={renderProps} />);
      const QAElement = screen.getByTestId('qa');
      expect(QAElement).toBeInTheDocument();
    })

  })

  describe('AnswerList Component', function() {

    test('should render the AnswerList component', function() {
      render(<AnswerList questionId="553704" answers={Object.values(product1Data[0]['answers'])} render={renderProps} />)
      const AnswerListElement = screen.getAllByTestId('a-list');
      expect(AnswerListElement.length > 0).toBe(true);
    })

    test('should render the "See More Answers" button when there are more than 2 answers', function() {
      render(<AnswerList questionId="553704" answers={Object.values(product1Data[0]['answers'])} render={renderProps} />)
      const AnswerListElement = screen.getByText('SEE MORE ANSWERS');
      expect(AnswerListElement).toBeInTheDocument();
    })

    test('should NOT render the "See More Answers" button when there are less than 2 answers', function() {
      render(<AnswerList questionId="553773" answers={Object.values(product1Data[3]['answers'])} render={renderProps} />)
      const AnswerListElement = screen.queryByText('SEE MORE ANSWERS');
      expect(AnswerListElement).toBeNull();
    })

    test('should expand answers', async function() {
      render(<AnswerList questionId="553704" answers={Object.values(product1Data[0]['answers'])} render={renderProps} />);
      fireEvent.click(await screen.findByTestId('a-more'));
      const AnswerListElement = (await screen.findByTestId('a-less'));
      expect(AnswerListElement).toBeInTheDocument();
    })

    test('should collapse answers', async function() {
      render(<AnswerList questionId="553704" answers={Object.values(product1Data[0]['answers'])} render={renderProps} />);
      fireEvent.click(await screen.findByTestId('a-more'));
      fireEvent.click(await screen.findByTestId('a-less'));
      const AnswerListElement = (await screen.findByTestId('a-more'));
      expect(AnswerListElement).toBeInTheDocument();
    })

  })

  describe('AnswerQuestion Component', function() {

    test('should render the AnswerQuestion component', function() {
      render(<AnswerQuestion render={renderProps} />);
      const AnswerQuestionElement = screen.getByTestId('answer-modal');
      expect(AnswerQuestionElement).toBeInTheDocument();
    })

    test('should render Answer Question button', async function() {
      render(<AnswerQuestion product_id={59557} render={renderProps} />);
      const AnswerQuestionElement = (await screen.findByText('Add Answer'));
      expect(AnswerQuestionElement).toBeInTheDocument();
    })

    test('should open modal when "Ask a question" is clicked', async function() {
      render(<AnswerQuestion product_id={59557} render={renderProps} />);
      fireEvent.click(await screen.findByTestId('add-answer'));
      const AnswerQuestionElement = (await screen.findByText('Submit your answer'));
      expect(AnswerQuestionElement).toBeInTheDocument();
    })

    test('should close modal when the close button is clicked', async function() {
      render(<AnswerQuestion product_id={59557} render={renderProps} />);
      fireEvent.click(await screen.findByTestId('add-answer'));
      fireEvent.click(await screen.findByTestId('close-qa-modal'));
      const AnswerQuestionElement = (await screen.queryByTestId('qa-modal-form'));
      expect(AnswerQuestionElement).toBeNull();
    })

    test('should render add photos button', async function() {
      render(<AnswerQuestion product_id={59557} render={renderProps} />);
      fireEvent.click(await screen.findByTestId('add-answer'));
      const AnswerQuestionElement = (await screen.findByText('ADD PHOTOS'));
      expect(AnswerQuestionElement).toBeInTheDocument();
    })

  })

  describe('Answers Component', function() {

    test('should render Answers components', function() {
      render(<Answers answer={Object.values(product1Data[0]['answers'])[0]} render={renderProps} />);
      const AnswersElement = screen.getByTestId('answers');
      expect(AnswersElement).toBeInTheDocument();
    })

    test('should render answers sorted by helpfulness', function() {
      render(<Questions questions={product1Data} render={renderProps} />);
      const TopAnswers = screen.getByTestId('weewoo');
      expect(TopAnswers).toBeInTheDocument();
    })

    test('should render Seller answer at top of answer list', function() {
      render(<Questions questions={product1Data} render={renderProps} />);
      const SellerAnswer = screen.getByText('Seller');
      expect(SellerAnswer).toBeInTheDocument();
    })

    // will need test server
    test('should increment helpfulness count by 1', async function() {
      render(<Questions questions={product1Data} render={renderProps}/>);
      fireEvent.click(await screen.findByTestId('a-help-5181545'));
      const AnswersElement = (await screen.findByText('(5)'));
      expect(AnswersElement).toBeInTheDocument();
    })

    // will need test server
    test('should change report to reported when clicked', async function() {
      render(<Questions questions={product3Data} render={renderProps} />);
      fireEvent.click(await screen.findByTestId('report'));
      const ReportElement = (await screen.findByText('Reported'));
      expect(ReportElement).toBeInTheDocument();

    })

    test('should open thumbnail modal', async function() {
      render(<Questions questions={product3Data} render={renderProps} />);
      fireEvent.click(await screen.findByTestId('a-thumbnail-0'));
      const ThumbnailElement = (await screen.findByTestId('a-thumbnail-modal'));
      expect(ThumbnailElement).toBeInTheDocument();
    })

    test('should close thumbnail modal', async function() {
      render(<Questions questions={product3Data} render={renderProps} />);
      fireEvent.click(await screen.findByTestId('a-thumbnail-0'));
      fireEvent.click(await screen.findByTestId('close-a-thumbnail'));
      const ThumbnailElement = (await screen.queryByTestId('a-thumbnail-modal'));
      expect(ThumbnailElement).toBeNull();
    })

  })

  describe('AskQuestion Component', function() {

    test('should render AskQuestion component', function() {
      render(<AskQuestion render={renderProps} />);
      const AskQuestionElement = screen.getByTestId('question-modal');
      expect(AskQuestionElement).toBeInTheDocument();
    })

    test('should render Submit Question button', async function() {
      render(<AskQuestion product_id={59557} render={renderProps} />);
      fireEvent.click(await screen.findByText('ASK A QUESTION'));
      const AskQuestionElement = (await screen.findByText('SUBMIT QUESTION'));
      expect(AskQuestionElement).toBeInTheDocument();
    })

    test('should open modal when "Ask a question" is clicked', async function() {
      render(<AskQuestion product_id={59557} render={renderProps} />);
      fireEvent.click(await screen.findByText('ASK A QUESTION'));
      const AskQuestionElement = (await screen.findByTestId('qa-modal-form'));
      expect(AskQuestionElement).toBeInTheDocument();
    })

    test('should close modal when the close button is clicked', async function() {
      render(<AskQuestion product_id={59557} render={renderProps} />);
      fireEvent.click(await screen.findByText('ASK A QUESTION'));
      fireEvent.click(await screen.findByTestId('close-qa-modal'));
      const AskQuestionElement = (await screen.queryByTestId('qa-modal-form'));
      expect(AskQuestionElement).toBeNull();
    })


  })

  describe('Questions Component', function() {

    test('should render Questions components', function() {
      render(<Questions questions={product1Data} render={renderProps} />);
      const QuestionsElement = screen.getByTestId('questions');
      expect(QuestionsElement).toBeInTheDocument();
    })

    test('should render questions', function() {
      render(<Questions questions={product1Data} render={renderProps} />);
      const QuestionsElement = screen.getByTestId('new sldkfjlsekjflsijefsef');
      expect(QuestionsElement).toBeInTheDocument();
    })

    test('should render "More Answered Questions" button when there are 3 or more questions', function() {
      render(<Questions questions={product1Data} render={renderProps} />);
      const TopQuestions = screen.getByText('MORE ANSWERED QUESTIONS');
      expect(TopQuestions).toBeInTheDocument();
    })

    test('should NOT render "More Answered Questions" button when there are 2 or less questions', function() {
      render(<Questions questions={product2Data} render={renderProps} />);
      const TopQuestions = screen.queryByText('MORE ANSWERED QUESTIONS');
      expect(TopQuestions).toBeNull();
    })

    // will need test server
    test('should increment helpfulness count by 1', async function () {
      render(<Questions questions={product1Data} render={renderProps} />);
      fireEvent.click(await screen.findByTestId('q-help-553704'));
      const QuestionsElement = (await screen.findByText('(2)'));
      expect(QuestionsElement).toBeInTheDocument();
    })

  })

  describe('SearchQuestion Component', function() {

    test('should render SearchQuestion component', function() {
      render(<SearchQuestion />);
      const SearchQuestionElement = screen.getByTestId('search-question');
      expect(SearchQuestionElement).toBeInTheDocument();
    })

    test('should render search bar with placeholder text', function() {
      render(<SearchQuestion />);
      const PlaceholderElement = screen.getByPlaceholderText('HAVE A QUESTION? SEARCH FOR ANSWERS...');
      expect(PlaceholderElement).toBeInTheDocument();
    })

  })

})
