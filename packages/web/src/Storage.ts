/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export interface File {
  name: string;
  contents: string;
}

export const storage = new Map<string, File>([
  ["pom.xml", { name: "pom.xml", contents: "" }],
  ["bento.dmn", { name: "bento.dmn", contents: "" }],
  [
    "dora.dmn",
    {
      name: "dora.dmn",
      contents:
        "<?xml version='1.0' encoding='UTF-8'?>\n" +
        '<semantic:definitions xmlns:semantic="http://www.omg.org/spec/DMN/20180521/MODEL/" xmlns="http://www.trisotech.com/definitions/_88671935-e3b8-448d-bd1d-8125a5e3c0ec" xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/" xmlns:kie="http://www.drools.org/kie/dmn/1.2" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:feel="http://www.omg.org/spec/DMN/20180521/FEEL/" xmlns:tc="http://www.omg.org/spec/DMN/20160719/testcase" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:trisofeed="http://trisotech.com/feed" xmlns:dmndi="http://www.omg.org/spec/DMN/20180521/DMNDI/" xmlns:triso="http://www.trisotech.com/2015/triso/modeling" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="_88671935-e3b8-448d-bd1d-8125a5e3c0ec" name="Drawing 1" expressionLanguage="http://www.omg.org/spec/DMN/20180521/FEEL/" typeLanguage="http://www.omg.org/spec/DMN/20180521/FEEL/" namespace="http://www.trisotech.com/definitions/_88671935-e3b8-448d-bd1d-8125a5e3c0ec">\n' +
        "  <semantic:extensionElements/>\n" +
        '  <semantic:inputData id="_952d9e47-596f-4af6-bed2-d0b55a045574" name="country">\n' +
        '    <semantic:variable id="_01977175-99a9-4a18-84bf-1b3de622253e" name="country" typeRef="string"/>\n' +
        "  </semantic:inputData>\n" +
        '  <semantic:inputData id="_d7023c73-e36d-4300-a460-0e86e5b6cd2c" name="ages">\n' +
        '    <semantic:variable id="_980f7a9b-8618-4969-9d7b-90a89021503f" name="ages" typeRef="number"/>\n' +
        "  </semantic:inputData>\n" +
        '  <semantic:textAnnotation id="_EC4BB099-283D-4CF4-BB96-965B367F7419" textFormat="text/plain">\n' +
        "    <semantic:text>TextAnnotation-1</semantic:text>\n" +
        "  </semantic:textAnnotation>\n" +
        "  <dmndi:DMNDI>\n" +
        "    <dmndi:DMNDiagram>\n" +
        "      <di:extension>\n" +
        "        <kie:ComponentsWidthsExtension/>\n" +
        "      </di:extension>\n" +
        '      <dmndi:DMNShape id="dmnshape-_952d9e47-596f-4af6-bed2-d0b55a045574" dmnElementRef="_952d9e47-596f-4af6-bed2-d0b55a045574" isCollapsed="false">\n' +
        '        <dmndi:DMNStyle fontFamily="arial,helvetica,sans-serif" fontSize="11">\n' +
        '          <dmndi:FillColor red="255" green="255" blue="255"/>\n' +
        '          <dmndi:StrokeColor red="0" green="0" blue="0"/>\n' +
        '          <dmndi:FontColor red="0" green="0" blue="0"/>\n' +
        "        </dmndi:DMNStyle>\n" +
        '        <dc:Bounds x="952.2590517997742" y="482" width="135.48189640045166" height="60"/>\n' +
        "        <dmndi:DMNLabel/>\n" +
        "      </dmndi:DMNShape>\n" +
        '      <dmndi:DMNShape id="dmnshape-_EC4BB099-283D-4CF4-BB96-965B367F7419" dmnElementRef="_EC4BB099-283D-4CF4-BB96-965B367F7419" isCollapsed="false">\n' +
        "        <dmndi:DMNStyle>\n" +
        '          <dmndi:FillColor red="255" green="255" blue="255"/>\n' +
        '          <dmndi:StrokeColor red="0" green="0" blue="0"/>\n' +
        '          <dmndi:FontColor red="0" green="0" blue="0"/>\n' +
        "        </dmndi:DMNStyle>\n" +
        '        <dc:Bounds x="184" y="41" width="100" height="50"/>\n' +
        "        <dmndi:DMNLabel/>\n" +
        "      </dmndi:DMNShape>\n" +
        '      <dmndi:DMNShape id="dmnshape-_d7023c73-e36d-4300-a460-0e86e5b6cd2c" dmnElementRef="_d7023c73-e36d-4300-a460-0e86e5b6cd2c" isCollapsed="false">\n' +
        '        <dmndi:DMNStyle fontFamily="arial,helvetica,sans-serif" fontSize="11">\n' +
        '          <dmndi:FillColor red="255" green="255" blue="255"/>\n' +
        '          <dmndi:StrokeColor red="0" green="0" blue="0"/>\n' +
        '          <dmndi:FontColor red="0" green="0" blue="0"/>\n' +
        "        </dmndi:DMNStyle>\n" +
        '        <dc:Bounds x="306.25905179977417" y="189" width="135.48189640045166" height="60"/>\n' +
        "        <dmndi:DMNLabel/>\n" +
        "      </dmndi:DMNShape>\n" +
        "    </dmndi:DMNDiagram>\n" +
        "  </dmndi:DMNDI>\n" +
        "</semantic:definitions>"
    }
  ]
]);
