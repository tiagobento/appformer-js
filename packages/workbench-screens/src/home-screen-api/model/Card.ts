/*
 *  Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { CardDescription } from "./CardDescription";

export class Card {
  public readonly iconCssClasses: string[];
  public readonly title: string;
  public readonly description: CardDescription;
  public readonly perspectiveId: string;
  public readonly onMayClick?: () => boolean;

  constructor(
    iconCssClasses: string[],
    title: string,
    description: CardDescription,
    perspectiveId: string,
    onMayClick?: () => boolean
  ) {
    this.iconCssClasses = iconCssClasses;
    this.title = title;
    this.description = description;
    this.perspectiveId = perspectiveId;
    this.onMayClick = onMayClick;
  }
}
