//#region imports
import type { FC } from "react";
import { EmptyBlock } from "../EmptyBlock";
import { getErrorMessage } from "../../../utils/getErrorMessage";
//#endregion

interface Props {
  error: unknown;
  fallback?: string;
}

export const QueryError: FC<Props> = ({ error, fallback = 'Failed to load data.' }) => (
  <EmptyBlock emptyMessage={getErrorMessage(error, fallback)} />
);
