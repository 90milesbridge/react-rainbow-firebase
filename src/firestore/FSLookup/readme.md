Basic example:

    <FSLookup
        label="Find user"
        collectionRef="users"
        optionsMapFn={(user) => ({
            label: `${user.data.firstName} ${user.data.lastName}`,
            description: user.data.type,
        })}
        value={state.value}
        onChange={(value) => setState({ value })} />

Patients example with includeValueAsOption:

    <FSLookup
        label="Find patient"
        collectionRef="patients"
        includeValueAsOption
        optionsMapFn={(patient) => {
            if (patient.isValueOption) {
                return patient;
            }
            return {
                label: patient.data.firstName,
            };
        }}
        value={state.value}
        onChange={(value) => setState({ value })} />


Example with initial value:

    const getDocReference = require('../../helpers/get-doc-reference').default;

    initialState = { value: {
        ref: getDocReference('users/5Bfk11EuAs05myqnMfaq'),
        id: '5Bfk11EuAs05myqnMfaq',
        data: {
            firstName: 'Pedro',
            lastName: 'Sanchez',
            phone: '765 1245 6543',
            type: 'regular',
        },
    }};

    <FSLookup
        label="Find user"
        collectionRef="users"
        value={state.value}
        onChange={(value) => setState({ value })} />

Example with only ref as initial value:

    const getDocReference = require('../../helpers/get-doc-reference').default;

    initialState = { value: {
        ref: getDocReference('users/5Bfk11EuAs05myqnMfaq'),
    }};

    <FSLookup
        label="Find user"
        collectionRef="users"
        value={state.value}
        onChange={(value) => setState({ value })} />

Example with redux form:

    const { Field, reduxForm } = require('redux-form');
    const { Button } = require('react-rainbow-components');

    const styles = {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 24,
    };

    function SimpleForm(props) {
        const {
            handleSubmit,
            reset,
            onSubmit,
        } = props;

        const submit = (values) => {
            onSubmit(values);
            reset();
        };

        return (
            <form
                noValidate
                onSubmit={handleSubmit(submit)}
            >
                <Field
                    component={FSLookup}
                    name="user"
                    required
                    label="Find user"
                    collectionRef="users"
                />
                <div style={styles}>
                    <Button label="submit" type="submit" />
                </div>
            </form>
        );
    }

    function validate(values) {
        const { user } = values;
        const errors = {};
        if (!user) {
            errors.user = 'User is a required field';
        }
        return errors;
    }

    const Form = reduxForm({
        form: 'user-form',
        validate,
        touchOnBlur: false,
    })(SimpleForm);

    <Form onSubmit={(values) => console.log(values)} />


Selected label example:

    <FSLookup
        label="Find user"
        collectionRef="users"
        optionsMapFn={(user) => ({
            selectedLabel: `${user.data.firstName}, ${user.data.type}`,
            label: `${user.data.firstName} ${user.data.lastName}`,
            description: user.data.type,
        })}
        value={state.value}
        onChange={(value) => setState({ value })} />
