import React, {useEffect} from 'react';

import {Route, Routes, useLocation, Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

import Toast from 'components/Toast';
import Notice from 'components/Notice';
import LoggedOutModal from 'components/LoggedOutModal';

import Home from 'containers/Home';
import Login from 'containers/Login';
import Register from 'containers/Register';
import About from 'containers/About';
import Access from 'containers/Access';
import Action from 'containers/Action';
import Contact from 'containers/Contact';
import Resources from 'containers/Resources';
import Account from 'containers/Account';
import Organizations from 'containers/Organizations';
import Error404 from 'containers/Error404';
import LegalDocument from 'containers/LegalDocument';
import PublicSurvey from 'containers/PublicSurvey';

import Administration from 'containers/Administration';
import AdministrationStatements from 'containers/Administration/Statements';
import AdministrationStatementDetails from 'containers/Administration/StatementDetails';
import AdministrationStatementWeightage from 'containers/Administration/StatementWeightage';

import Projects from 'containers/Projects';
import ProjectDashboard from 'containers/Projects/Dashboard';
import ProjectList from 'containers/Projects/List';

import SurveyDashboard from 'containers/Surveys/Dashboard';
import SurveyFeedback from 'containers/Surveys/Feedback';

import AuthRoute from './AuthRoute';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
    const {pathname} = useLocation();
    const {showExpiryModal} = useSelector(state => state.ui);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [pathname]);

    return (
        <>
            <Notice />
            <Routes>
                <Route path="/">
                    <Route index element={<Home />} />
                    <Route path="login" element={<AuthRoute><Login /></AuthRoute>} />
                    <Route path="register" element={<AuthRoute><Register /></AuthRoute>} />
                    <Route path="projects" element={<PrivateRoute><Projects /></PrivateRoute>}>
                        <Route path="" element={<ProjectList />} />
                        <Route path=":projectId" element={<ProjectDashboard />} />
                        <Route path=":projectId/surveys" element={<ProjectDashboard />} />
                        <Route path=":projectId/surveys/:surveyId">
                            <Route index element={<SurveyDashboard />} />
                            <Route path="feedback" element={<SurveyFeedback />} />
                        </Route>
                    </Route>
                    <Route path="account" element={<PrivateRoute><Account /></PrivateRoute>} />
                    <Route path="organizations" element={<PrivateRoute><Organizations /></PrivateRoute>} />
                    <Route path="administration" element={<PrivateRoute><Administration /></PrivateRoute>}>
                        <Route path="" element={<Navigate to="/administration/statements" replace />} />
                        <Route exact path="statements">
                            <Route path="" element={<AdministrationStatements />} />
                            <Route path=":statementId">
                                <Route index element={<AdministrationStatementDetails />} />
                                <Route path="weightage" element={<AdministrationStatementWeightage />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="access" element={<Access />} />
                    <Route path="action" element={<Action />} />
                    <Route path="resource" element={<Resources />} />
                    <Route path="legal-document" element={<LegalDocument />} />
                    <Route path="survey/:identifier" element={<PublicSurvey />} />
                </Route>
                <Route path="*" element={<Error404 />} />
            </Routes>
            <Toast />
            <LoggedOutModal isVisible={showExpiryModal} />
        </>
    );
};

export default AppRoutes;
