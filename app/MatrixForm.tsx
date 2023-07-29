"use client";

import React, { useEffect, useState } from "react";
import { Button } from "antd";
import {
  useForm,
  Controller,
  FieldErrors,
  SubmitHandler,
} from "react-hook-form";
import { Alert } from "antd";
import ICell from "./ICell";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const iFormInputSchema = z.object({
  variables: z
    .array(
      z
        .number()
        .int()
        .positive()
        .max(16, "You have to fill numbers from 1 to 16")
        .nullable()
        .optional()
    )
    .length(16)
    .refine((data) => data.filter((item) => Boolean(item)).length >= 3, {
      message: "In order to solve it we need at least 3 filled cells.",
    })
    .refine((data) => data.includes(null) || data.includes(undefined), {
      message: "To solve it we need at least one empty cell.",
    }),
  sumConstants: z
    .array(
      z
        .number({
          invalid_type_error:
            "All the values to which the rows and columns are equal are required and should be positive integers.",
        })
        .int()
        .positive()
    )
    .length(8),
});

type IFormInput = z.infer<typeof iFormInputSchema>;

type Square = {
  [key: number]: number;
};

type SquareSolverResponse = Square[];

const MatrixForm = () => {
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  const [apiMessage, setApiMessage] = useState<{
    type: "success" | "warning" | "error";
    message: string;
  }>();
  const [formInitialValuesState, setFormInitialValuesState] =
    useState<IFormInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>({
    defaultValues: {
      variables: Array(16).fill(null),
      sumConstants: Array(8).fill(null),
    },
    resolver: zodResolver(iFormInputSchema),
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setFirstError(errors);
    }
  }, [errors]);

  const setFirstError = (errors: FieldErrors<IFormInput>) => {
    if (!errors) return;
    console.log("errors", errors);

    const errorsArrayFirstElement = Object.values(errors)[0];
    let firstErrorFound;
    if (Array.isArray(errorsArrayFirstElement)) {
      firstErrorFound = errorsArrayFirstElement.find((error) => {
        return error?.message;
      });
    } else {
      firstErrorFound = errorsArrayFirstElement;
    }

    if (!firstErrorFound) return;

    setApiMessage({
      type: "error",
      message:
        firstErrorFound?.message || "There is an error filling the the square",
    });
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    try {
      setApiMessage(undefined);
      setFormSubmitted(true);
      setFormInitialValuesState(data);
      setIsLoading(true);
      const response: { data: SquareSolverResponse } = await axios.post(
        "/api/python",
        data
      );
      setIsLoading(false);
      const solution = response.data;
      handleSolution(solution);
    } catch (error) {
      setApiMessage({
        type: "error",
        message: "There was an error solving the square",
      });
    }
  };

  const handleSolution = (solution: SquareSolverResponse) => {
    if (!solution || solution.length === 0) {
      setApiMessage({ type: "warning", message: "There is no solution" });
      return;
    }

    if (solution.length > 1) {
      setApiMessage({
        type: "warning",
        message: `There are ${solution.length} solutions. Only the first one will be shown`,
      });
    }

    const singleSolution = solution[0];

    Object.keys(singleSolution).forEach((key) => {
      setValue(`variables.${Number(key)}`, singleSolution[Number(key)]);
    });
  };

  const clearState = () => {
    setFormSubmitted(false);
    setApiMessage(undefined);
    setFormInitialValuesState(null);
    setValue("variables", Array(16).fill(undefined));
    setValue("sumConstants", Array(8).fill(undefined));
  };

  const loadExample = () => {
    clearState();
    setValue("sumConstants", Array(8).fill(34));
    setValue("variables.1", 2);
    setValue("variables.2", 3);
    setValue("variables.4", 5);
    setValue("variables.8", 9);
  };

  return (
    <div style={{ display: "inline-blok" }}>
      <div className='flex flex-col space-y-[8px] items-start'>
        <div className='flex flex-row space-x-[8px] items-start'>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            {Array.from({ length: 16 }, (_, i) => (
              <Controller
                name={`variables.${i}`}
                control={control}
                render={({ field }) => (
                  <ICell
                    disabled={
                      isFormSubmitted &&
                      Boolean(formInitialValuesState) &&
                      formInitialValuesState?.variables[i] == null
                    }
                    {...field}
                  />
                )}
                key={i}
              />
            ))}
          </div>
          <div className='flex flex-col space-y-[8px] items-start'>
            {Array.from({ length: 4 }, (_, i) => (
              <Controller
                name={`sumConstants.${i}`}
                control={control}
                render={({ field }) => <ICell type='success' {...field} />}
                key={i}
              />
            ))}
          </div>
        </div>
        <div className='flex flex-row space-x-[8px] items-start'>
          {Array.from({ length: 4 }, (_, i) => (
            <Controller
              name={`sumConstants.${i + 4}`}
              control={control}
              render={({ field }) => <ICell type='success' {...field} />}
              key={i}
            />
          ))}
        </div>
      </div>

      {apiMessage?.message ? (
        <Alert
          style={{ marginTop: 16, width: "274px" }}
          message={apiMessage.message}
          type={apiMessage.type}
          showIcon
          closable
          onClose={() => setApiMessage(undefined)}
        />
      ) : null}

      <Button
        size='large'
        type='primary'
        loading={isLoading}
        style={{ marginTop: 16, backgroundColor: "#1677ff", width: "100%" }}
        onClick={handleSubmit(onSubmit)}
      >
        Solve
      </Button>
      <Button
        size='large'
        style={{ marginTop: 4, width: "50%" }}
        onClick={clearState}
      >
        Clear
      </Button>
      <Button
        size='large'
        style={{ marginTop: 4, width: "50%" }}
        onClick={loadExample}
      >
        Load example
      </Button>
    </div>
  );
};

export default MatrixForm;
