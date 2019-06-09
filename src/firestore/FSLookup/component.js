import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetchValue from './services/fetch-value';
import getDocReference from '../../helpers/get-doc-reference';
import {
    filter,
    getNormalizedOptions,
    getNormalizedValue,
} from './helpers';

const privateOptions = Symbol('privateOptions');

export default class FSLookupComponent extends Component {
    constructor(props) {
        super(props);
        const { data, optionsMapFn } = props;
        this.state = {
            options: [],
            value: null,
        };
        this[privateOptions] = getNormalizedOptions(data, optionsMapFn);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.resolveValue();
    }

    componentDidUpdate(prevProps) {
        const {
            data: prevData,
            value: prevValue,
        } = prevProps;
        const { data, value, optionsMapFn } = this.props;
        if (data !== prevData) {
            this[privateOptions] = getNormalizedOptions(data, optionsMapFn);
        }
        if (value !== prevValue) {
            if (value === '') {
                this.resetOptions();
            }
            this.resolveValue();
        }
    }

    resolveValue() {
        const {
            value,
            optionsMapFn,
            data: options,
        } = this.props;

        return fetchValue(options, getNormalizedValue(value))
            .then(fetchedValue => {
                this.setState({
                    value: fetchedValue ? optionsMapFn(fetchedValue) : null,
                });
            });
    }

    handleSearch(value) {
        this.setState({
            options: filter(value, this[privateOptions]),
        });
    }

    handleChange(value) {
        const { onChange, collectionRef } = this.props;
        if (value) {
            const docRef = `${collectionRef}/${value.id}`;
            return onChange({
                ref: getDocReference(docRef),
                data: value.data,
            });
        }
        return onChange(value);
    }

    resetOptions() {
        this.setState({
            options: [],
        });
    }

    render() {
        const {
            lookupComponent: LookupComponent,
            onChange,
            collectionRef,
            optionsMapFn,
            isLoading,
            addDoc,
            addDocs,
            removeDoc,
            removeDocs,
            updateDoc,
            updateDocs,
            error,
            lookupError,
            ...rest
        } = this.props;
        const { options, value } = this.state;

        return (
            <LookupComponent
                {...rest}
                options={options}
                value={value}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                error={lookupError}
            />
        );
    }
}

FSLookupComponent.propTypes = {
    data: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    collectionRef: PropTypes.string.isRequired,
    lookupComponent: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    optionsMapFn: PropTypes.func.isRequired,
    addDoc: PropTypes.func.isRequired,
    addDocs: PropTypes.func.isRequired,
    removeDoc: PropTypes.func.isRequired,
    removeDocs: PropTypes.func.isRequired,
    updateDoc: PropTypes.func.isRequired,
    updateDocs: PropTypes.func.isRequired,
    error: PropTypes.object,
    lookupError: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
};

FSLookupComponent.defaultProps = {
    value: undefined,
    error: undefined,
    lookupError: undefined,
};