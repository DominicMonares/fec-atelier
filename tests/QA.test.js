/**
 * @jest-environment jsdom
*/

import React from 'react';
import _ from 'underscore';
import '@testing-library/jest-dom';
import {render, screen, cleanup, fireEvent, waitFor} from '@testing-library/react';
import {product1Data, product2Data} from './samples/sample-qa-data.js';

import QA from '../client/src/components/QA/QA.jsx';
import AnswerList from '../client/src/components/QA/components/AnswerList.jsx';
import AnswerQuestion from '../client/src/components/QA/components/AnswerQuestion.jsx';
import Answers from '../client/src/components/QA/components/Answers.jsx';
import AskQuestion from '../client/src/components/QA/components/AskQuestion.jsx';
import Questions from '../client/src/components/QA/components/Questions.jsx';
import SearchQuestion from '../client/src/components/QA/components/SearchQuestion.jsx';

describe('Questions & Answers', function() {

  describe('QA Component', function() {

    test('should render the QA component', function() {
      render(<QA itemid={59557} />);
      const QAElement = screen.getByTestId('qa');
      expect(QAElement).toBeInTheDocument();
    })

  })

  describe('AnswerList Component', function() {

    test('should render the AnswerList component', function() {
      render(<AnswerList questionId="553704" answers={Object.values(product1Data[0]['answers'])} />)
      const AnswerListElement = screen.getAllByTestId('answer-list');
      expect(AnswerListElement.length > 0).toBe(true);
    })

    test('should render the "See More Answers" button when there are more than 2 answers', function() {
      render(<AnswerList questionId="553704" answers={Object.values(product1Data[0]['answers'])} />)
      const AnswerListElement = screen.getByText('See More Answers');
      expect(AnswerListElement).toBeInTheDocument();
    })

    test('should NOT render the "See More Answers" button when there are less than 2 answers', function() {
      render(<AnswerList questionId="553773" answers={Object.values(product1Data[3]['answers'])} />)
      const AnswerListElement = screen.queryByText('See More Answers');
      expect(AnswerListElement).toBeNull();
    })

  })

  describe('AnswerQuestion Component', function() {

    test('should render the AnswerQuestion component', function() {
      render(<AnswerQuestion />);
      const AnswerQuestionElement = screen.getByTestId('answer-modal');
      expect(AnswerQuestionElement).toBeInTheDocument();
    })

  })

  describe('Answers Component', function() {

    test('should render Answers components', function() {
      render(<Answers answer={Object.values(product1Data[0]['answers'])[0]} />);
      const AnswersElement = screen.getByTestId('answers');
      expect(AnswersElement).toBeInTheDocument();
    })

    test('should render answers sorted by helpfulness', function() {
      render(<Questions questions={product1Data} />);
      const TopAnswers = screen.getByTestId('weewoo');
      expect(TopAnswers).toBeInTheDocument();
    })

    test('should render Seller answer at top of answer list', function() {
      render(<Questions questions={product1Data} />);
      const SellerAnswer = screen.getByText('Seller');
      expect(SellerAnswer).toBeInTheDocument();
    })

  })

  describe('AskQuestion Component', function() {

    test('should render AskQuestion component', function() {
      render(<AskQuestion />);
      const AskQuestionElement = screen.getByTestId('question-modal');
      expect(AskQuestionElement).toBeInTheDocument();
    })

  })

  describe('Questions Component', function() {

    test('should render Questions components', function() {
      render(<Questions questions={product1Data} />);
      const QuestionsElement = screen.getByTestId('questions');
      expect(QuestionsElement).toBeInTheDocument();
    })

    test('should render "More Answered Questions" button when there are 3 or more questions', function() {
      render(<Questions questions={product1Data} />);
      const TopQuestions = screen.getByText('More Answered Questions');
      expect(TopQuestions).toBeInTheDocument();
    })

    test('should NOT render "More Answered Questions" button when there are 2 or less questions', function() {
      render(<Questions questions={product2Data} />);
      const TopQuestions = screen.queryByText('More Answered Questions');
      expect(TopQuestions).toBeNull();
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
      const PlaceholderElement = screen.getByPlaceholderText('Have a question? Search for answers...');
      expect(PlaceholderElement).toBeInTheDocument();
    })

  })

})
