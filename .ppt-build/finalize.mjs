import {pathToFileURL} from 'node:url';
import path from 'node:path';
const skill='C:/Users/29824/.codex/plugins/cache/openai-primary-runtime/presentations/26.1022.11436/skills/presentations';
const {finalizePresentation}=await import(pathToFileURL(skill+'/container_tools/artifact_tool_utils.mjs'));
const root=path.resolve('.');
const result=await finalizePresentation({workspaceDir:root,candidatePath:root+'/.ppt-build/candidate-linked.pptx',finalPath:root+'/output/从隋唐盛世到五代十国_互动课堂.pptx',pythonExecutable:'C:/Users/29824/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Microsoft YaHei']},verifyArtifactToolImport:true,receiptPath:root+'/.ppt-build/validation-final.json'});
console.log(JSON.stringify(result));


