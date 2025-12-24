import React, { type FormEventHandler } from 'react'

interface FormProps {
    name: string | undefined,
    description: string | undefined,
    handleFormDataChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

function ConfirmInitialDetailsStage({ handleFormDataChange, name, description }: FormProps) {

    return (
        <div>
            ConfirmInitialDetailsStage
            <h1>
                {name}
            </h1>
            <h1>
                {description}
            </h1>

            <form >
                <input type="text" name='name' value={name} onChange={handleFormDataChange} />
                <textarea name="description" id="" value={description} onChange={handleFormDataChange} />
            </form>
        </div>
    )
}

export default ConfirmInitialDetailsStage